/**
 * 把文本保存到本地文件:
 * - 移动端(含 Capacitor WebView)优先走系统分享面板,可「保存到文件 / 云盘 / 发给自己」;
 *   WebView 不处理 blob 下载,这是 App 内唯一可靠的落盘途径
 * - 桌面浏览器直接下载
 */
export type SaveResult = 'shared' | 'downloaded' | 'failed';

const isMobile = (): boolean => /Android|iPhone|iPad|iPod|HarmonyOS/i.test(navigator.userAgent);

export async function saveTextFile(name: string, text: string, mime = 'text/plain'): Promise<SaveResult> {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  if (isMobile()) {
    try {
      const file = new File([blob], name, { type: mime });
      const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
      if (typeof nav.share === 'function' && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: name });
        return 'shared';
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') return 'failed';
    }
  }
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return 'downloaded';
  } catch {
    return 'failed';
  }
}
