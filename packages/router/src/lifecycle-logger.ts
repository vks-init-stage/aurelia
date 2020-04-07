export function lifecycleLogger(name: string) {
  const lifecycles = [
    'canLeave', 'leave',
    'canEnter', 'enter',
    'created',
    'beforeBind', 'afterBindChildren',
    'beforeAttach', 'afterAttachChildren',
    'beforeDetach', 'afterDetachChildren',
    'beforeUnbind', 'afterUnbindChildren',
  ];

  return function (target: any) {
    for (const lifecycle of lifecycles) {
      const existing = target.prototype[lifecycle];
      if (existing !== void 0) {
        target.prototype[lifecycle] = function (...args: unknown[]) {
          console.log(`${name} ${lifecycle}`, args);
          return existing.apply(target, args);
        };
      } else {
        target.prototype[lifecycle] = function (...args: unknown[]) {
          console.log(`${name} ${lifecycle}`, args);
          if (lifecycle.startsWith('can')) {
            return true;
          }
        };
      }
    }
  };
}

export class LifecycleClass {
  public canEnter() { console.log(`name canEnter`); return true; }
  public enter(params: any) { console.log(`name enter`); }
  public created() { console.log(`name created`); }
  public beforeBind() { console.log(`name binding`); }
  public afterBindChildren() { console.log(`name bound`); }
  public beforeAttach() { console.log(`name beforeAttach`); }
  public afterAttachChildren() { console.log(`name afterAttachChildren`); }
  public canLeave() { console.log(`name canLeave`); return true; }
  public leave() { console.log(`name leave`); }
  public beforeDetach() { console.log(`name beforeDetach`); }
  public afterDetachChildren() { console.log(`name afterDetachChildren`); }
  public beforeUnbind() { console.log(`name beforeUnbind`); }
  public afterUnbindChildren() { console.log(`name unbound`); }
}
