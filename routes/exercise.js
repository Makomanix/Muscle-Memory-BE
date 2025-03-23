const express = require('express')
const { body, check } = require('express-validator');

const router = express.Router();

router.get('/', isAuth );

router.post('/', isAuth, isAdmin );

router.get('/:exerciseId', isAuth );

router.get('/:primary', isAuth);

router.get('/:secondary', isAuth)

router.patch('/:exerciseId', isAuth, isAdmin);

router.delete('/:exerciseId', isAuth, isAdmin);

module.exports = router;