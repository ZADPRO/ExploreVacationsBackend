export const  selectUserByLogin =`SELECT *
FROM  public."refUserDomain" rd
WHERE rd."refUserEmail" = $1 OR rd."refUsername" = $1;`;