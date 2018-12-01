export enum modes {
    AUTO,
    STREAM,
    SYNC,
    CONFIG
};

export interface modeSubscriber {
    id: string;
    handler: (mode: modes) => void;
}