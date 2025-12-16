// Backbone-style class extension helper
// From Backbone.js (https://github.com/documentcloud/backbone)

type Constructor<T = object> = new (...args: unknown[]) => T;
type ProtoProps = Record<string, unknown> & { constructor?: Constructor };
type StaticProps = Record<string, unknown>;

function copyProps(dest: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  for (const key in source) {
    dest[key] = source[key];
  }
  return dest;
}

// Shared empty constructor function to aid in prototype-chain creation.
function Ctor() {}

// Helper function to correctly set up the prototype chain, for subclasses.
function inherits<T>(
  parent: Constructor<T>,
  protoProps?: ProtoProps,
  staticProps?: StaticProps
): Constructor<T> & { __super__: T; extend: typeof extend } {
  let child: Constructor<T>;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your extend definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && Object.prototype.hasOwnProperty.call(protoProps, 'constructor')) {
    child = protoProps.constructor as Constructor<T>;
  } else {
    child = function (this: T, ...args: unknown[]) {
      return parent.apply(this, args);
    } as unknown as Constructor<T>;
  }

  // Inherit class (static) properties from parent.
  copyProps(child as unknown as Record<string, unknown>, parent as unknown as Record<string, unknown>);

  // Set the prototype chain to inherit from parent, without calling
  // parent's constructor function.
  (Ctor as unknown as Constructor).prototype = parent.prototype;
  child.prototype = new (Ctor as unknown as Constructor)();

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) copyProps(child.prototype, protoProps);

  // Add static properties to the constructor function, if supplied.
  if (staticProps) copyProps(child as unknown as Record<string, unknown>, staticProps);

  // Correctly set child's 'prototype.constructor'.
  child.prototype.constructor = child;

  // Set a convenience property in case the parent's prototype is needed later.
  (child as Constructor<T> & { __super__: T }).prototype.__super__ = parent.prototype;

  return child as Constructor<T> & { __super__: T; extend: typeof extend };
}

// The self-propagating extend function that Backbone classes use.
export default function extend<T>(this: Constructor<T>, protoProps?: ProtoProps, classProps?: StaticProps): Constructor<T> & { __super__: T; extend: typeof extend } {
  const child = inherits(this, protoProps, classProps);
  child.extend = extend;
  return child;
}
