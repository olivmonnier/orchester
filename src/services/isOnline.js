export default function () {
  try {
    return navigator.onLine
  } catch (e) {
    throw new Error("your browser can't detect online state");
  }
}
