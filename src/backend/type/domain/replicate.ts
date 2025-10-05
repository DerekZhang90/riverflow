export default interface Prediction {
    id: string;
    detail: string;
    status: string;
    output?: string;
    version?: string;
    logs?: string;
    created_at: string;
    started_at: string;
    completed_at: string;
    request_id?: string;  // Yunwu API 返回的 request_id 字段
}

