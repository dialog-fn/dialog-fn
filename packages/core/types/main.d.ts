export function createStore(createState: any): ((createState: any) => {
    setState: (partial: any, replace: any) => void;
    getState: () => {
        /**
         * - an ID.
         */
        id: string;
        /**
         * - your name.
         */
        name: string;
        /**
         * - your age.
         */
        age: number;
    };
    subscribe: (listener: any) => () => any;
}) | {
    setState: (partial: any, replace: any) => void;
    getState: () => {
        /**
         * - an ID.
         */
        id: string;
        /**
         * - your name.
         */
        name: string;
        /**
         * - your age.
         */
        age: number;
    };
    subscribe: (listener: any) => () => any;
};
//# sourceMappingURL=main.d.ts.map