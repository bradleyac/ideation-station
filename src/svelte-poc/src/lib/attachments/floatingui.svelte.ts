import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { asyncScheduler, debounceTime, distinctUntilChanged, filter, fromEvent, map, mergeWith, Observable, Subscription, tap, throttleTime, withLatestFrom } from "rxjs";

// data-ideaid set on the nodes
// When a node should be the current node, call "setCurrent" with the contents of data-ideaid

export function tooltipAttachment({ tip, setCurrent }: { tip: HTMLElement, setCurrent: (id: string) => void }) {
  return (node: HTMLElement) => {
    if (!tip) return;
    // Do this with Rx not with event listeners directly.

    let sub = new Subscription();

    const esc$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter(e => e.key === 'Escape'));
    const mouseOver$ = fromEvent<MouseEvent>(node, 'mouseover');
    const mouseOut$ = fromEvent<MouseEvent>(node, 'mouseout');
    const inTooltip$ = fromEvent<MouseEvent>(tip, 'mouseenter');
    const outTooltip$ = fromEvent<MouseEvent>(tip, 'mouseleave');
    const focusIn$ = fromEvent<FocusEvent>(node, 'focusin');
    const focusOut$ = fromEvent<FocusEvent>(node, 'focusout');
    const touchEnd$ = fromEvent<TouchEvent>(node, 'touchend');
    const touchTooltip$ = fromEvent<TouchEvent>(tip, 'touchend');

    const relevantFocusIn$ = focusIn$.pipe(map<FocusEvent, [number, HTMLElement, string]>(evt => [evt.timeStamp, evt.target as HTMLElement, (evt.target as HTMLElement).dataset?.['ideaid'] ?? ""]),
      filter(e => e[2] !== ""));

    const relevantFocusOut$ = focusOut$.pipe
      (
        filter(evt => (evt.target as HTMLElement).dataset?.['ideaid'] !== undefined),
        map(evt => evt.timeStamp)
      );

    const lastOver$ = mouseOver$.pipe
      (
        map<MouseEvent, [number, HTMLElement, string]>(evt => [evt.timeStamp, evt.target as HTMLElement, (evt.target as HTMLElement).dataset?.['ideaid'] ?? ""]),
        filter(e => e[2] !== "")
      );

    const lastOut$ = mouseOut$.pipe
      (
        filter(evt => (evt.target as HTMLElement).dataset?.['ideaid'] !== undefined),
        map(evt => evt.timeStamp)
      );

    const show$ = lastOver$.pipe(mergeWith(relevantFocusIn$));
    const showTime$ = show$.pipe(map(e => e[0]))
    const hide$ = lastOut$.pipe
      (
        mergeWith(relevantFocusOut$),
        mergeWith(outTooltip$.pipe(map(tt => tt.timeStamp))),
      );

    sub.add(
      show$.pipe
        (
          debounceTime(300, asyncScheduler),
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
            mergeWith(inTooltip$.pipe(map(e => e.timeStamp))),
            mergeWith(touchTooltip$.pipe(map(e => e.timeStamp + 500)))
          )
        ),
        // tap(([outTime, inTime]) => console.log(`out: ${outTime}, in: ${inTime}`)),
        filter(([outTime, inTime]) => outTime > inTime),
        mergeWith(esc$)
      ).subscribe(hideTooltip)
    );

    sub.add(
      touchEnd$.pipe
        (
          map<TouchEvent, [TouchEvent, HTMLAnchorElement | null]>(e => [e, (e.target as HTMLElement).nodeName === 'A' ? e.target as HTMLAnchorElement : null]),
          filter(([e, node]) => node !== null && node !== document.activeElement),
        ).subscribe(([e, node]) => {
          e.preventDefault();
          node?.focus();
        })
    )

    function update(target: HTMLElement) {
      if (!tip) return;
      computePosition(target, tip, {
        placement: 'bottom-start',
        middleware: [flip(), shift({ padding: 8 })]
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