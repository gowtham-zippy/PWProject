import type { Page } from '@playwright/test';
import { ContactFormModal } from './ContactFormModal';

/** Modal opened via a row's edit button, pre-filled with the contact's data. */
export class EditContactModal extends ContactFormModal {
  constructor(page: Page) {
    super(page, 'edit-contact-modal', 'edit-contact-form');
  }
}
