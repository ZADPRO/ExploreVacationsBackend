import axios from "axios";
import * as turf from "@turf/turf";

const zurichPolygon = require("../../helper/zurich.geo.json");

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_BACKEND_KEY;

export class GoogleAPIRepo {
  public async getSuggestionsService(query: string): Promise<any> {
    try {
      if (!query || query.trim().length < 2) {
        return { success: false, suggestions: [], message: "Query too short" };
      }

      const autoURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query
      )}&components=country:ch&key=${GOOGLE_API_KEY}`;

      const autoRes = await axios.get(autoURL);
      console.log("autoRes", autoRes);
      const autoData: any = autoRes.data;
      console.log("autoData", autoData);

      const predictions = autoData?.predictions || [];
      const results: any[] = [];

      for (const p of predictions) {
        const placeId = p.place_id;

        const detailURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
        const detailRes = await axios.get(detailURL);
        console.log("detailRes", detailRes);

        const detailData: any = detailRes.data;
        console.log("detailData", detailData);
        const loc = detailData?.result?.geometry?.location;
        console.log("loc", loc);

        if (!loc) continue;

        const lat = loc.lat;
        const lng = loc.lng;

        // Extract postal code from address components
        const addressComponents = detailData?.result?.address_components || [];
        console.log("addressComponents", addressComponents);
        const postalComponent = addressComponents.find((comp: any) =>
          comp.types.includes("postal_code")
        );
        const postalCode = postalComponent ? postalComponent.long_name : null;
        console.log("postalCode", postalCode);

        // Zürich polygon check
        const point = turf.point([lng, lat]);
        console.log("point", point);
        const isInside = turf.booleanPointInPolygon(point, zurichPolygon);
        if (!isInside) continue;
        console.log("isInside", isInside);

        // Push with postalCode included
        results.push({
          name: p.description,
          placeId,
          lat,
          lng,
          postalCode,
        });
      }

      return {
        success: true,
        suggestions: results,
      };
    } catch (err) {
      console.log("getSuggestionsService ERROR:", err);
      return { success: false, suggestions: [], error: String(err) };
    }
  }

  public async validateAddressService(address: string): Promise<any> {
    console.log("\n\n\naddress", address);
    try {
      if (!address || address.trim().length < 2) {
        return {
          success: false,
          insideZurich: false,
          message: "Invalid address",
        };
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_API_KEY}`;

      const geoRes = await axios.get(url);
      console.log("geoRes", geoRes);
      const data: any = geoRes.data;
      console.log("data", data);

      if (!data || data.status !== "OK" || !data.results?.length) {
        return {
          success: false,
          insideZurich: false,
          message: "Unable to find this address",
        };
      }

      const loc = data.results[0].geometry.location;
      const lat = loc.lat;
      const lng = loc.lng;

      const point = turf.point([lng, lat]);
      const isInside = turf.booleanPointInPolygon(point, zurichPolygon);

      return {
        success: true,
        insideZurich: isInside,
        lat,
        lng,
        formattedAddress: data.results[0].formatted_address,
      };
    } catch (error) {
      console.log("validateAddressService ERROR:", error);
      return {
        success: false,
        insideZurich: false,
        message: "Error validating address",
        error: String(error),
      };
    }
  }
}
