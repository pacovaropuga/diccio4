const express = require('express');
const router = express.Router();

// Controllers
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const TermController = require('../controllers/TermController');
const EntryController = require('../controllers/EntryController');
const VariantController = require('../controllers/VariantController');
const TranslationController = require('../controllers/TranslationController')


// Home
router.get('/', (req,res) => res.json({hello: "Api rest Diccionario"}));

// Login
// router.post('/api/signin', AuthController.signIn);
// router.post('/api/signup', AuthController.signUp);

// Users
router.get('/api/users', UserController.findAllUsers);
router.get('/api/user/:id', UserController.findUserById);
router.post('/api/users', UserController.createUser);
router.put('/api/user/:id', UserController.updateUser);
router.delete('/api/user/:id', UserController.deleteUserById);
//router.delete('/api/users', UserController.deleteAllUsers);

// Terms
router.get('/api/terms', TermController.findAllTerms);
router.get('/api/terms/:word', TermController.findTermByWord);
router.get('/api/term/:id', TermController.findTermById);
router.post('/api/terms', TermController.createTerm);
router.put('/api/term/:id', TermController.updateTerm);
router.delete('/api/term/:id', TermController.deleteTermById);

// Examples
router.get('/api/examples/', TermController.examples);

// Entries
router.get('/api/entries', EntryController.findAllEntries);
router.get('/api/entry/:id', EntryController.findEntryById);
router.get('/api/entries/children', EntryController.findEntryChildrenByTerm);
router.get('/api/entries/parents', EntryController.findEntryParentsByTerm);
router.get('/api/entry', EntryController.findEntriesByTerm);
router.post('/api/entries', EntryController.createEntry);
router.put('/api/entry/:id', EntryController.updateEntry);
router.delete('/api/entry/:id', EntryController.deleteEntryById);

// Variants
router.get('/api/variants', VariantController.findAllVariants);
//router.get('/api/variant/:id', VariantController.findVariantById);
router.get('/api/variant/:idEntry', VariantController.findVariantByIdEntry);
router.post('/api/variants', VariantController.createVariant);
router.put('/api/variant/:id', VariantController.updateVariant);
router.delete('/api/variant/:id', VariantController.deleteVariantById);

// Translations

router.post('/api/translations', TranslationController.add)

module.exports=router;

