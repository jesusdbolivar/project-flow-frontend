import { formBuilderHandlers } from './form-builder.handlers';
import { formsHandlers } from './forms.handlers';
import { usersHandlers } from './users.handlers';

export const handlers = [
  ...formsHandlers,
  ...formBuilderHandlers,
  ...usersHandlers,
];
