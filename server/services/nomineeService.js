import * as nomineeQueries from '../queries/nomineeQueries.js'

export async function getNominees() {
  return nomineeQueries.getAllActiveNominees()
}

export async function saveNominee({ firstName, lastName, email, address, assetName, assetPercentage }) {
  return nomineeQueries.createNominee({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    address: address?.trim() ?? null,
    assetName: assetName?.trim() ?? null,
    assetPercentage: assetPercentage ?? null,
  })
}

export async function editNominee(nomineeId, fields) {
  return nomineeQueries.editNominee(nomineeId, fields)
}
