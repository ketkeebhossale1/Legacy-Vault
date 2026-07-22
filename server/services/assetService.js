import * as assetQueries from '../queries/assetQueries.js'

export async function listAssets(testatorId) {
  return assetQueries.findAllAssets(testatorId)
}

export async function getAsset(id) {
  return assetQueries.findAssetById(id)
}

export async function createAsset(input) {
  return assetQueries.insertAsset(normalizeAsset(input))
}

export async function updateAsset(id, input) {
  return assetQueries.updateAssetById(id, normalizeAsset(input))
}

export async function removeAsset(id) {
  return assetQueries.deleteAssetById(id)
}

function normalizeAsset({ name, category, nomineeName, accessLevel }) {
  return {
    name: name.trim(),
    category: category.trim(),
    nomineeName: nomineeName?.trim() || null,
    accessLevel: accessLevel === 'full' ? 'full' : 'view',
  }
}
