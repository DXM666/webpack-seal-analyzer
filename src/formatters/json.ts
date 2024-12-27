import { AnalysisData } from '../types';

export class JsonFormatter {
    static format(data: AnalysisData): string {
        return JSON.stringify(data, null, 2);
    }
}
