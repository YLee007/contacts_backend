import { Router } from 'express';
import { createContact, getContacts, getContactById, updateContact, deleteContact, toggleFavoriteContact } from '../controllers/contactController';
import { validate } from '../middleware/validation';
import { createContactSchema, updateContactSchema, getContactByIdSchema, deleteContactSchema, getContactsSchema } from '../schemas/contactSchemas';

const router: Router = Router();

router.post('/', validate(createContactSchema), createContact);
router.get('/', validate(getContactsSchema), getContacts);
router.get('/:id', validate(getContactByIdSchema), getContactById);
router.put('/:id', validate(updateContactSchema), updateContact);
router.delete('/:id', validate(deleteContactSchema), deleteContact);
router.patch('/:id/favorite', toggleFavoriteContact); // New route to toggle favorite status

export default router;
