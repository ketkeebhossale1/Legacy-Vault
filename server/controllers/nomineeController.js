import * as nomineeService from '../services/nomineeService.js'

const invalid = (res, message) => res.status(400).json({ success: false, message, data: null })

export async function listNominees(req, res, next) {
  try {
    const nominees = await nomineeService.getNominees(req.user.id)
    return res.status(200).json({ success: true, message: 'OK', data: nominees })
  } catch (error) { next(error) }
}

export async function createNominee(req, res, next) {
  try {
    const { firstName, lastName, email, address, assetName, assetPercentage, isExecutor } = req.body

    if (!firstName) return invalid(res, 'firstName is required')
    if (!lastName)  return invalid(res, 'lastName is required')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return invalid(res, 'A valid email is required')

    // Asset fields are only required for nominees, not executors
    if (!isExecutor) {
      if (assetPercentage !== undefined && assetPercentage !== null) {
        const pct = Number(assetPercentage)
        if (isNaN(pct) || pct < 0 || pct > 100)
          return invalid(res, 'assetPercentage must be between 0 and 100')
      }
    }

    const nominee = await nomineeService.saveNominee(req.user.id, {
      firstName, lastName, email, address, assetName, assetPercentage, isExecutor: !!isExecutor,
    })
    return res.status(201).json({ success: true, message: isExecutor ? 'Executor saved' : 'Nominee saved', data: nominee })
  } catch (error) { next(error) }
}

export async function updateNominee(req, res, next) {
  try {
    const { id } = req.params
    const { firstName, lastName, email, address, assetName, assetPercentage, isExecutor } = req.body

    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return invalid(res, 'Provide a valid email')
    if (assetPercentage !== undefined && assetPercentage !== null) {
      const pct = Number(assetPercentage)
      if (isNaN(pct) || pct < 0 || pct > 100)
        return invalid(res, 'assetPercentage must be between 0 and 100')
    }

    const fields = { firstName, lastName, email, address, assetName, assetPercentage, isExecutor }
    const hasField = Object.values(fields).some(v => v !== undefined)
    if (!hasField) return invalid(res, 'Provide at least one field to update')

    const nominee = await nomineeService.editNominee(id, req.user.id, fields)
    if (!nominee) return res.status(404).json({ success: false, message: 'Record not found or already inactive', data: null })

    return res.status(200).json({ success: true, message: 'Updated successfully', data: nominee })
  } catch (error) { next(error) }
}
