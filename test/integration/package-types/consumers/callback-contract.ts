import { type ObservableOptions, observable, viewModel } from '@mcpeasy/knockback';
import Backbone from 'backbone';

class Person extends Backbone.Model<{ name?: string }> {}

const person = new Person({ name: 'Ada' });

export const inferredRequired = observable(person, {
  key: 'name',
  args: ['!'],
  read: (key: unknown, suffix: string) => `${typeof key === 'string' ? key : 'unknown'}${suffix}`,
});

// @ts-expect-error a required inferred callback tuple requires args
observable(person, { key: 'name', read: (_key: unknown, suffix: string) => suffix });
// @ts-expect-error undefined does not supply a required callback tuple
observable(person, { key: 'name', args: undefined, read: (_key: unknown, suffix: string) => suffix });
// @ts-expect-error an empty tuple does not supply the required suffix
observable(person, { key: 'name', args: [], read: (_key: unknown, suffix: string) => suffix });
// @ts-expect-error the supplied tuple is missing the required count
observable(person, { key: 'name', args: ['!'], read: (_key: unknown, suffix: string, count: number) => suffix.repeat(count) });
// @ts-expect-error the supplied tuple has the wrong element type
observable(person, { key: 'name', args: [1], read: (_key: unknown, suffix: string) => suffix });

export const zeroArgument = observable(person, { key: 'name', read: () => 'zero' });
export const optionalArgument = observable(person, {
  key: 'name',
  read: (_key: unknown, suffix?: string) => suffix ?? 'optional',
});
export const restArguments = observable(person, {
  key: 'name',
  read: (_key: unknown, ...suffixes: string[]) => suffixes.join(','),
});
export const suppliedRestArguments = observable(person, {
  key: 'name',
  args: ['a', 'b'],
  read: (_key: unknown, ...suffixes: string[]) => suffixes.join(','),
});

const explicitOptions: ObservableOptions<string, [suffix: string], string, string> = {
  key: 'name',
  args: ['!'],
  read: (key, suffix) => `${typeof key === 'string' ? key : 'unknown'}${suffix}`,
};
export const explicitRequired = observable<string, Person, [string], string, string>(person, explicitOptions);

// @ts-expect-error naming a required tuple does not make missing args safe
const missingExplicitArgs: ObservableOptions<string, [suffix: string], string, string> = {
  key: 'name',
  read: (_key, suffix) => suffix,
};
void missingExplicitArgs;

// @ts-expect-error an explicit required observable tuple still requires args
observable<string, Person, [string], string, string>(person, {
  key: 'name',
  read: (_key, suffix) => suffix,
});

const dynamicKey: string = person.has('name') ? 'name' : '';
export const dynamicKeyReader = observable(person, {
  key: dynamicKey,
  read: (key) => (typeof key === 'string' ? key.toUpperCase() : 'missing'),
});
export const missingKeyIgnored = observable(person, { read: () => 'missing-key' });
export const emptyKeyIgnored = observable(person, { key: '', read: () => 'empty-key' });

// @ts-expect-error a direct missing key is not known to be a string
observable(person, { read: (key) => key.toUpperCase() });
// @ts-expect-error an empty key falls back to the options object at runtime
observable(person, { key: '', read: (key) => key.toUpperCase() });
// @ts-expect-error a dynamic string may be empty and does not prove the callback input
observable(person, { key: dynamicKey, read: (key) => key.toUpperCase() });

export const mapped = viewModel<{ name: unknown }, Person>(person, {
  mappings: { name: { read: (key) => (typeof key === 'string' ? key.toUpperCase() : 'unknown') } },
});

void [inferredRequired, zeroArgument, optionalArgument, restArguments, suppliedRestArguments, explicitRequired, dynamicKeyReader, missingKeyIgnored, emptyKeyIgnored, mapped];
