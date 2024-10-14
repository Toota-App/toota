/**
 * Observe the given element applying
 * the given effect to provided elements.
 * 
 * @param {MutableRefObject} observerRef The element to observe
 * @param {[{element: MutableRefObject, classList: []}]} effectRefs An array 
 * of objects containing the elements to animate
 * and their corresponding utitlity class names.
 * Eg. `[ {element: elementRef, classList: ['w-1', 'h-1']}, {} ]`
 * @param {object} options An object containing
 * the options for controlling the intersection
 * observer API.
 */
export default function registerComponentInObserver(observerRef, effectRefs, options) {
    const observerElement = observerRef.current;

    const observer = new IntersectionObserver((items) => {
        for (const item of items) {
            if (item.isIntersecting) {
                effectRefs.forEach((elementRef) => {
                    const { element } = elementRef;
                    const target = element.current;
                    const { classList } = elementRef;
                    classList.forEach((cls) => {
                        target.classList.add(cls);
                    })
                })
            }
        }
    }, options);

    observer.observe(observerElement);
}