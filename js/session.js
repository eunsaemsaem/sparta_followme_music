// 세션 값 추가
export function setSession(name, value) {
    sessionStorage.setItem(name, value);
}

// 세션 값 조회
export function getSession(name) {
    return sessionStorage.getItem(name);
}

// 세션 값 삭제
export function deleteSession() {
    sessionStorage.clear();
}