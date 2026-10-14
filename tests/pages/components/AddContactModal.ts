import type { Page } from '@playwright/test';
import { ContactFormModal } from './ContactFormModal';

/** Modal opened via the "new contact" button. */
export class AddContactModal extends ContactFormModal {
  constructor(page: Page) {
    super(page, 'add-contact-modal', 'add-contact-form');
  }
}
