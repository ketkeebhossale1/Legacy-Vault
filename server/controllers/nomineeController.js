import * as nomineeService from '../services/nomineeService.js'

const invalid = (res, message) => res.status(400).json({ success: false, message, data: null })

export async function listNominees(req, res, next) {
  try {
    const nominees = await nomineeService.getNominees()
    return res.status(200).json({ success: true, message: 'OK', data: nominees })
  } catch (error) { next(error) }
}

export async function createNominee(req, res, next) {
  try {
    const { firstName, lastName, email, address, assetName, assetPercentage } = req.body

    if (!firstName) return invalid(res, 'firstName is required')
    if (!lastName)  return invalid(res, 'lastName is required')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return invalid(res, 'A valid email is required')
    if (assetPercentage !== undefined && assetPercentage !== null) {
      const pct = Number(assetPercentage)
      if (isNaN(pct) || pct < 0 || pct > 100)
        return invalid(res, 'assetPercentage must be between 0 and 100')
    }

    const nominee = await nomineeService.saveNominee({ firstName, lastName, email, address, assetName, assetPercentage })
    return res.status(201).json({ success: true, message: 'Nominee saved', data: nominee })
  } catch (error) { next(error) }
}

export async function updateNominee(req, res, next) {
  try {
    const { id } = req.params
    const { firstName, lastName, email, address, assetName, assetPercentage } = req.body

    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return invalid(res, 'Provide a valid email')
    if (assetPercentage !== undefined && assetPercentage !== null) {
      const pct = Number(assetPercentage)
      if (isNaN(pct) || pct < 0 || pct > 100)
        return invalid(res, 'assetPercentage must be between 0 and 100')
    }

    const fields = { firstName, lastName, email, address, assetName, assetPercentage }
    const hasField = Object.values(fields).some(v => v !== undefined)
    if (!hasField) return invalid(res, 'Provide at least one field to update')

    const nominee = await nomineeService.editNominee(id, fields)
    if (!nominee) return res.status(404).json({ success: false, message: 'Nominee not found or already inactive', data: null })

    return res.status(200).json({ success: true, message: 'Nominee updated', data: nominee })
  } catch (error) { next(error) }
}
