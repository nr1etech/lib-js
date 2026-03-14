import {component$, useSignal} from '@builder.io/qwik';
import {PaceBar} from '../components/pace-bar';
import {AlertSuccess} from '../components/alert-success';
import {AlertWarning} from '../components/alert-warning';
import {AlertError} from '../components/alert-error';
import {AlertInfo} from '../components/alert-info';
import {Dialog} from '../components/dialog';
import {TextField} from '../components/text-field';
import {
  MdiAirHorn,
  MdiDangerous,
  MdiInstantMix,
  MdiTerminal,
  Nr1eLogoTaglineLightBg,
} from '@nr1e/qwik-icons';
import {CheckboxField} from '../components/checkbox-field';
import {FieldSet} from '../components/fieldset';
import {SelectField} from '../components/select-field';
import {SubmitButton} from '../components/submit-button';
import {AddButton} from '../components/add-button';
import {
  DropUp,
  DropUpButton,
  DropUpButtonSelector,
  DropUpLink,
  DropUpSubmenu,
} from '../components/drop-up';
import {AutoDismiss} from '../components/auto-dismiss';
import {GoogleSignInButton} from '../components/google-sign-in-button';
import {MicrosoftSignInButton} from '../components/microsoft-sign-in-button';
import {Dock, DockLink, DockLabel, DockButton} from '../components/dock';
import {ThemeSelector} from '../components/theme-selector';
import {TimeZoneSelector} from '../components/time-zone-selector';
import {FormatDate} from '../components/format-date';
import {FormatDateTime} from '../components/format-date-time';

export default component$(() => {
  const openDialog1 = useSignal(false);
  const openDialog2 = useSignal(false);
  const openDialog3 = useSignal(false);
  const openDialog4 = useSignal(false);
  const openDialog4Loading = useSignal(true);
  const dialog3Error = useSignal<string | undefined>(undefined);
  const dialog3Warning = useSignal<string | undefined>(undefined);
  const autoDismissVisible = useSignal<boolean>(true);
  const now = useSignal(new Date().toISOString());
  return (
    <div class="flex flex-col items-center p-4">
      <Nr1eLogoTaglineLightBg height={96} />
      <h1 class="pt-4 text-4xl">Qwik UI</h1>

      {/* Navigation Links */}
      <div class="my-6 flex gap-4">
        <a href="/universal-layout-demo" target="_blank">
          <button class="btn btn-primary">View UniversalLayout Demo</button>
        </a>

        <a href="/menu-demo" target="_blank">
          <button class="btn btn-primary">View Menu Demo</button>
        </a>
      </div>
      <div class="flex w-full max-w-4xl flex-col space-y-6 pb-[200px]">
        <div class="w-full space-y-2">
          <div class="text-2xl">Selectors</div>
          <ThemeSelector />
          <TimeZoneSelector />
        </div>

        <div class="w-full space-y-2">
          <div class="text-2xl">Formatters</div>
          <div class="bg-base-200 p-4">
            <FormatDate date={now.value} />
          </div>
          <div class="bg-base-200 p-4">
            <FormatDateTime date={now.value} />
          </div>
        </div>

        <div class="w-full space-y-2">
          <div class="text-2xl">AutoDismiss</div>
          <AutoDismiss
            visible={autoDismissVisible}
            onDismiss$={() => {
              console.log('Dismissed!');
            }}
          >
            Some text is going to disappear
          </AutoDismiss>
          AutoDismiss is currently{' '}
          {autoDismissVisible.value ? 'visible' : 'hidden'}
          <button
            class="btn"
            onClick$={() => (autoDismissVisible.value = true)}
          >
            Make visible
          </button>
        </div>

        <div class="w-full space-y-2">
          <div class="text-2xl">PaceBar</div>
          <PaceBar value={1} class="progress-accent" />
          <PaceBar value={20} class="progress-accent" />
          <PaceBar value={40} class="progress-accent" />
          <PaceBar value={60} class="progress-accent" />
          <PaceBar value={80} class="progress-accent" />
          <PaceBar value={100} class="progress-accent" />
          <PaceBar value={-1} class="progress-accent" />
          <PaceBar value={1} asymptotic={true} class="progress-accent" />
        </div>

        <div class="w-full space-y-2">
          <div class="text-2xl">Alert</div>
          <AlertInfo message="This is an informational message" />
          <AlertSuccess message="This is a successful message" />
          <AlertWarning message="This is a warning message" />
          <AlertError message="This is an error message" />
        </div>
        <div class="pad-4 w-full space-y-2">
          <div class="text-2xl">Drop Up</div>
          <div class="flex gap-4">
            <DropUp>
              <DropUpButtonSelector>Drop Up</DropUpButtonSelector>
              <DropUpSubmenu>
                <DropUpLink href="#nowhere">Something link 1</DropUpLink>
                <DropUpLink href="#nowhere">Something link 2</DropUpLink>
                <DropUpLink href="#nowhere">Something link 3</DropUpLink>
                <DropUpButton
                  onClick$={() => {
                    alert('Clicked!');
                  }}
                >
                  Something button 4
                </DropUpButton>
              </DropUpSubmenu>
            </DropUp>
          </div>
        </div>

        <div class="pad-4 w-full space-y-2">
          <div class="text-2xl">Dialog</div>
          <div class="flex gap-4">
            <button class="btn" onClick$={() => (openDialog1.value = true)}>
              Open
            </button>
            <button class="btn" onClick$={() => (openDialog2.value = true)}>
              Open title
            </button>
            <button class="btn" onClick$={() => (openDialog3.value = true)}>
              Open error
            </button>
            <button class="btn" onClick$={() => (openDialog4.value = true)}>
              Open loading
            </button>
          </div>
          <Dialog id="dialog1" open={openDialog1} showCloseIcon={true}>
            <div>Nothing to see here.</div>
            <div q:slot="action">Just some text</div>
            <button
              q:slot="action"
              class="btn"
              onClick$={() => (openDialog1.value = false)}
            >
              Close
            </button>
          </Dialog>
          <Dialog
            id="dialog2"
            open={openDialog2}
            showCloseIcon={true}
            title="Doing something"
          >
            <div>Nothing to see here.</div>
            <button
              class="btn"
              q:slot="action"
              onClick$={() => (openDialog2.value = false)}
            >
              Close
            </button>
          </Dialog>
          <Dialog
            id="dialog3"
            open={openDialog3}
            showCloseIcon={true}
            title="Doing something"
            warningMessage={dialog3Warning.value}
            errorMessage={dialog3Error.value}
            onOpen$={(e) => {
              console.log('Opened', e.id);
            }}
            onClose$={(e) => {
              console.log('Closed', e.id);
            }}
          >
            <div>Nothing to see here.</div>
            <button
              q:slot="action"
              class="btn btn-ghost"
              onClick$={() => {
                dialog3Warning.value = undefined;
                dialog3Error.value = undefined;
              }}
            >
              Clear
            </button>
            <button
              q:slot="action"
              class="btn"
              onClick$={() => (dialog3Warning.value = 'Warning message')}
            >
              Show Warning
            </button>
            <button
              q:slot="action"
              class="btn"
              onClick$={() => (dialog3Error.value = 'Error message')}
            >
              Show Error
            </button>
          </Dialog>
          <Dialog
            id="dialog2"
            open={openDialog4}
            loading={openDialog4Loading}
            showCloseIcon={true}
            title="Doing something"
          >
            <div>Nothing to see here.</div>
          </Dialog>
        </div>

        <div class="w-full space-y-2">
          <div class="text-2xl">TextField</div>
          <div class="flex flex-wrap gap-4">
            <div class="w-sm">
              <TextField
                label="Enter something"
                error="Something bad happened"
              />
            </div>
            <div class="w-sm">
              <TextField label="Enter something" placeholder="1234565" />
            </div>
            <div class="w-sm">
              <TextField
                label="Enter something"
                placeholder="1234565"
                error="Something bad happened"
              />
            </div>
            <div class="w-sm">
              <TextField label="Enter something">
                <div q:slot="right" class="opacity-50">
                  <MdiAirHorn size={24} />
                </div>
              </TextField>
            </div>
            <div class="w-sm">
              <TextField label="Enter something" error="Something bad happened">
                <div q:slot="left" class="opacity-50">
                  <MdiAirHorn size={24} />
                </div>
              </TextField>
            </div>
          </div>
        </div>

        <div class="w-full space-y-2">
          <div class="text-2xl">SelectField</div>
          <div class="flex flex-wrap gap-4">
            <div class="w-sm">
              <SelectField label="Select one">
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </SelectField>
            </div>
            <div class="w-sm">
              <SelectField label="Select one">
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </SelectField>
            </div>
            <div class="w-sm">
              <SelectField label="Select one" error="Something bad happened">
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </SelectField>
            </div>
          </div>
        </div>

        <div class="w-full space-y-2">
          <div class="text-2xl">CheckboxField</div>
          <div class="flex flex-wrap gap-4">
            <div class="w-sm">
              <CheckboxField label="Remember me" checked={true} />
            </div>
            <div class="w-sm">
              <CheckboxField
                label="Remember me"
                checked={true}
                error="You have an error"
              />
            </div>
          </div>
        </div>

        <div class="w-full space-y-2">
          <div class="text-2xl">FieldSet</div>
          <div class="flex flex-wrap gap-4">
            <FieldSet legend="User Information">
              <div class="space-y-4">
                <TextField label="Name" placeholder="Enter your name" />
                <TextField label="Email" placeholder="Enter your email" />
              </div>
            </FieldSet>
            <FieldSet>
              <div class="space-y-4">
                <TextField label="Address" placeholder="Enter your address" />
              </div>
            </FieldSet>
          </div>
        </div>

        <div class="w-full space-y-2">
          <div class="text-2xl">Buttons</div>
          <div class="flex flex-wrap gap-4 space-y-2 space-x-2">
            <AddButton>Add something</AddButton>
            <AddButton class="btn-primary">Add something</AddButton>
            <SubmitButton>Submit</SubmitButton>
            <SubmitButton processing={true}>Processing</SubmitButton>
            <SubmitButton disabled={true}>Disabled</SubmitButton>
            <GoogleSignInButton />
            <MicrosoftSignInButton />
          </div>
        </div>
      </div>
      <Dock>
        <DockButton
          onClick$={() => {
            alert('Clicked!');
          }}
        >
          <MdiTerminal size={24} />
          <DockLabel>Compute</DockLabel>
        </DockButton>
        <DockLink href="#nowhere">
          <MdiDangerous size={24} />
          <DockLabel>Implode</DockLabel>
        </DockLink>
        <DockLink href="#nowhere">
          <MdiInstantMix size={24} />
          <DockLabel>Mix Master</DockLabel>
        </DockLink>
      </Dock>
    </div>
  );
});
