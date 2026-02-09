import * as s from 'superstruct';

// 허용된 업로드 폴더 목록 (uploads 제거)
export const UploadFolder = s.enums(['products', 'articles', 'profiles']);

export const UploadFileQuery = s.object({
  folder: UploadFolder, // 필수 입력으로 변경
});

export type UploadFileQueryType = s.Infer<typeof UploadFileQuery>;
