import * as nomineeQueries from '../queries/nomineeQueries.js'

export async function getNominees(userId) {
  return nomineeQueries.getAllActiveNominees(userId)
}

export async function saveNominee(userId, { firstName, lastName, email, address, assetName, assetPercentage, isExecutor }) {
  return nomineeQueries.createNominee({
    userId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    address: address?.trim() ?? null,
    assetName: assetName?.trim() ?? null,
    assetPercentage: assetPercentage ?? null,
    isExecutor: !!isExecutor,
  })
}

export async function editNominee(nomineeId, userId, fields) {
  return nomineeQueries.editNominee(nomineeId, userId, fields)
}
