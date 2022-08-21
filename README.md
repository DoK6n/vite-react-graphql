# 파이어베이스 구글 로그인 플로우

1. firebase/auth -> 로그인 및 회원가입 시도
2. firebase auth에 구글 인증으로 회원 생성후 토큰 발급
   1. 존재하는 회원인지 firebase에서 검증
3. 로그인시 zustand에 의해 로컬스토리지에 유저 정보 저장
