import usersController from './users.controller'
import express from 'express'

const router = express.Router()

router.post('/create-user', usersController.createUser)

export default router
