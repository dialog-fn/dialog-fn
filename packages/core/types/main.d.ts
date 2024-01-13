export function createStore(createState: any): {
    setState: (partial: any, replace: any) => void;
    getState: () => any;
    subscribe: (listener: any) => () => boolean;
};
//# sourceMappingURL=main.d.ts.map