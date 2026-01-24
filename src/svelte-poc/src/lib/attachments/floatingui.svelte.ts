import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { asyncScheduler, distinctUntilChanged, filter, fromEvent, map, mergeWith, Observable, Subscription, throttleTime, withLatestFrom } from "rxjs";

// data-ideaid set on the nodes
// When a node should be the current node, call "setCurrent" with the contents of data-ideaid

export function tooltipAttachment({ tip, setCurrent }: { tip: HTMLElement, setCurrent: (id: string) => void }) {
  return (node: HTMLElement) => {
    if (!tip) return;
    // Do this with Rx not with event listeners directly.

    //TODO: also listen to taps to focus the tapped element and not follow the link the first time (mobile only)

    let sub = new Subscription();

    const esc$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter(e => e.key === 'Escape'));
    const mouseOver$ = fromEvent<MouseEvent>(node, 'mouseover');
    const mouseOut$ = fromEvent<MouseEvent>(node, 'mouseout');
    const inTooltip$ = fromEvent<MouseEvent>(tip, 'mouseenter');
    const outTooltip$ = fromEvent<MouseEvent>(tip, 'mouseleave');
    const isInTooltip$ = inTooltip$.pipe
      (
        map(_ => "in" as const),
        mergeWith(outTooltip$.pipe
          (
            map(_ => "out" as const)
          )
        ),
        map(inOrOut => inOrOut === "in")
      );

    const lastOver$ = mouseOver$.pipe
      (
        map<MouseEvent, [HTMLElement, string]>(evt => [evt.target as HTMLElement, (evt.target as HTMLElement).dataset?.['ideaid'] ?? ""]),
        filter(e => e[1] !== "")
      );

    const lastOut$ = mouseOut$.pipe
      (
        map<MouseEvent, [HTMLElement, string]>(evt => [evt.target as HTMLElement, (evt.target as HTMLElement).dataset?.['ideaid'] ?? ""]),
        filter(e => e[1] !== "")
      );

    const wasOutLast$ = lastOver$.pipe
      (
        map(_ => "in" as const),
        mergeWith(lastOut$.pipe
          (
            map(_ => "out" as const)
          )),
        map(inOrOut => inOrOut === "out")
      );

    sub.add(
      lastOver$.subscribe(([target, id]) => {
        setCurrent(id);
        showTooltip(target);
      }));

    sub.add(
      lastOut$.pipe
        (
          throttleTime(200, asyncScheduler, { leading: false, trailing: true }),
          withLatestFrom(lastOver$, wasOutLast$, isInTooltip$),
        ).subscribe(([[el, id], [_, lastOverId], outLast, isInTooltip]) => {
          if (id === lastOverId && outLast && !isInTooltip) {
            hideTooltip();
          }
        })
    );

    sub.add(outTooltip$.pipe(map(_ => { }), mergeWith(esc$.pipe(map(_ => { })))).subscribe(hideTooltip));

    function update(target: HTMLElement) {
      if (!tip) return;
      computePosition(target, tip, {
        placement: 'bottom-end',
        middleware: [offset(8), flip(), shift({ padding: 8 })]
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

    node.addEventListener('focusin', e => {
      const id = (e.target as HTMLElement)?.dataset?.['ideaid'];
      if (id !== undefined) {
        setCurrent(id);
        showTooltip((e.target as HTMLElement));
      }
    });

    node.addEventListener('focusout', e => {
      hideTooltip();
      if ((e.target as HTMLElement)?.dataset?.['ideaid'] !== undefined) {
      }
    });

    return () => sub.unsubscribe();
  };
}