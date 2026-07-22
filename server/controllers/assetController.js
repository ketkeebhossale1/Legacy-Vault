import * as assetService from '../services/assetService.js'

const send = (res, status, data, message = 'Success') => res.status(status).json({ success: true, message, data })

export async function list(req, res, next) {
  try {
    if (!req.query.testatorId) return res.status(400).json({ success: false, message: 'testatorId is required', data: null })
    send(res, 200, await assetService.listAssets(req.query.testatorId))
  } catch (error) { next(error) }
}

export async function getById(req, res, next) {
  try {
    const asset = await assetService.getAsset(req.params.id)
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found', data: null })
    send(res, 200, asset)
  } catch (error) { next(error) }
}

export async function create(req, res, next) {
  try {
    const validationError = validateAsset(req.body)
    if (validationError) return res.status(400).json({ success: false, message: validationError, data: null })
    send(res, 201, await assetService.createAsset(req.body), 'Asset created')
  } catch (error) { next(error) }
}

export async function update(req, res, next) {
  try {
    const validationError = validateAsset(req.body)
    if (validationError) return res.status(400).json({ success: false, message: validationError, data: null })
    const asset = await assetService.updateAsset(req.params.id, req.body)
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found', data: null })
    send(res, 200, asset, 'Asset updated')
  } catch (error) { next(error) }
}

export async function remove(req, res, next) {
  try {
    if (!await assetService.removeAsset(req.params.id)) return res.status(404).json({ success: false, message: 'Asset not found', data: null })
    send(res, 200, null, 'Asset deleted')
  } catch (error) { next(error) }
}

function validateAsset({ name, category }) {
  if (!name?.trim()) return 'Asset name is required'
  if (!category?.trim()) return 'Asset category is required'
  return null
}
