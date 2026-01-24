import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { asyncScheduler, debounceTime, distinctUntilChanged, filter, fromEvent, map, mergeWith, NEVER, Observable, Subscription, tap, throttleTime, withLatestFrom } from "rxjs";

// data-ideaid set on the nodes
// When a node should be the current node, call "setCurrent" with the contents of data-ideaid

export function tooltipAttachment({ tip, setCurrent }: { tip: HTMLElement, setCurrent: (id: string) => void }) {
  return (node: HTMLElement) => {
    if (!tip) return;

    // TODO: ALMOST THERE! Still need to dismiss the popup when the idea it's for disappears.

    // TODO: Can this be simplified by swapping out streams we don't want on this device with NEVER and then doing everything the same way for both?
    // No reason we can't have a subscription to touchEnd$ when using a mouse when touchEnd$ is NEVER.

    // function isTouchPointer() {
    //   return matchMedia("(pointer: coarse)").matches;
    // }

    function getIdeaId(target: any) {
      return (target as HTMLElement).dataset?.['ideaid']
    }

    const isTouchPointer = matchMedia("(pointer: coarse)").matches;

    let sub = new Subscription();

    const esc$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter(e => e.key === 'Escape'));

    const lastOver$ = fromEvent<MouseEvent>(node, 'mouseover').pipe
      (
        map<MouseEvent, [number, HTMLElement, string]>(evt => [evt.timeStamp, evt.target as HTMLElement, getIdeaId(evt.target) ?? ""]),
        filter(e => e[2] !== "")
      );
    const lastOut$ = fromEvent<MouseEvent>(node, 'mouseout').pipe
      (
        filter(evt => getIdeaId(evt.target) !== undefined),
        map(evt => evt.timeStamp)
      );
    const inTooltip$ = fromEvent<MouseEvent>(tip, 'mouseenter').pipe(map(e => e.timeStamp));
    const outTooltip$ = fromEvent<MouseEvent>(tip, 'mouseleave').pipe(map(tt => tt.timeStamp));

    const touchEnd$ = fromEvent<TouchEvent>(node, 'touchend');
    // Buffered 500ms because lose focus happens right after.
    const touchTooltip$ = fromEvent<TouchEvent>(tip, 'touchend').pipe(map(e => e.timeStamp + 500));

    const lastFocusIn$ = fromEvent<FocusEvent>(node, 'focusin').pipe
      (
        map<FocusEvent, [number, HTMLElement, string]>(evt => [evt.timeStamp, evt.target as HTMLElement, getIdeaId(evt.target) ?? ""]),
        filter(e => e[2] !== "")
      );
    const lastFocusOut$ = fromEvent<FocusEvent>(node, 'focusout').pipe
      (
        filter(evt => getIdeaId(evt.target) !== undefined),
        map(evt => evt.timeStamp)
      );

    const show$ = isTouchPointer ? lastFocusIn$ : lastOver$.pipe(mergeWith(lastFocusIn$));
    const showTime$ = show$.pipe(map(e => e[0]))
    const errantTouch$ = touchEnd$.pipe(filter(e => e.target !== tip && getIdeaId(e.target) === undefined), map(e => e.timeStamp));

    const hide$ = isTouchPointer
      ? lastFocusOut$.pipe(mergeWith(errantTouch$))
      : lastOut$.pipe(mergeWith(lastFocusOut$), mergeWith(outTooltip$),);

    sub.add(
      show$.pipe
        (
          debounceTime(200, asyncScheduler),
        )
        .subscribe(([time, target, id]) => {
          setCurrent(id);
          showTooltip(target);
        }));

    sub.add(
      hide$.pipe(
        debounceTime(300, asyncScheduler),
        withLatestFrom(showTime$.pipe
          (
            mergeWith(isTouchPointer
              ? touchTooltip$
              : inTooltip$),
          )
        ),
        filter(([outTime, inTime]) => outTime > inTime),
        mergeWith(esc$)
      ).subscribe(hideTooltip)
    );

    // Listen to touchEnd$ on mobile to allow focusing on the links since you can't hover.
    if (isTouchPointer) {
      sub.add(
        touchEnd$.pipe
          (
            map<TouchEvent, [TouchEvent, HTMLAnchorElement | null]>(e => [e, (e.target as HTMLElement).nodeName === 'A' ? e.target as HTMLAnchorElement : null]),
            filter(([e, node]) => node !== null && node !== document.activeElement),
          ).subscribe(([e, node]) => {
            e.preventDefault();
            node?.focus();
          })
      );
    }

    function update(target: HTMLElement) {
      if (!tip) return;
      computePosition(target, tip, {
        placement: 'top',
        middleware: [flip(), shift()]
      }).then(({ x, y }) => {
        Object.assign(tip.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      })
    }

    function showTooltip(target: HTMLElement) {
      if (!tip) return;
      tip.style.display = 'block';
      update(target);
    }

    function hideTooltip() {
      if (!tip) return;
      tip.style.display = '';
    }

    return () => sub.unsubscribe();
  };
}