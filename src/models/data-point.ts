export interface DataPoint{
    ParentName: string,
    ElementName: string,
    AttributeName: string,
    PITag: string,
    Values: Event[]    
}

export interface Event{
    value: string,
    valueDT: Date
}