import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getDocs, query } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
// import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
// 쿠키 관련 모듈 호출
import { setSession, getSession, deleteSession } from "./session.js";

// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCdAbo_ViOKm3gYiMKDm1a4PLzvQXjK6IQ",
    authDomain: "team-followme-miniproject.firebaseapp.com",
    projectId: "team-followme-miniproject",
    storageBucket: "team-followme-miniproject.appspot.com",
    messagingSenderId: "475357059255",
    appId: "1:475357059255:web:59ae12e37a4ee731b85532",
    measurementId: "G-KHREYSMK6P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// const user = auth.currentUser;

// !! 세션에서 데이터 꺼내 쓰는법 !!
// getSession("uid")

// 로그인 체크 함수
const loginCheck = () => {
    const top_btns = document.querySelectorAll("body > div > nav > ol > ol")[0].children;
    if (getSession("uid")) {
        // 로그인 되었을 때 sign in, sign up 버튼 삭제
        for (let i = 0; i < top_btns.length - 1; i++) {
            top_btns[i].classList.add("hidden");
        }
        top_btns[top_btns.length - 1].classList.remove("hidden");
        document.getElementById("co_star").disabled = false;
        document.getElementById("co_input").disabled = false;
        document.getElementById("co_btn").disabled = false;
    } else {
        // 로그인 상태가 아니라면 sign in, sign up 버튼 띄워줌
        // 로그인 되었을 때 sign in, sign up 버튼 삭제
        for (let i = 0; i < top_btns.length - 1; i++) {
            top_btns[i].classList.remove("hidden");
        }
        top_btns[top_btns.length - 1].classList.add("hidden");
        document.getElementById("co_star").disabled = true;
        document.getElementById("co_input").disabled = true;
        document.getElementById("co_btn").disabled = true;
    }
}

loginCheck();

// 음악 랭킹
fetch("https://raw.githubusercontent.com/KoreanThinker/billboard-json/main/billboard-hot-100/recent.json").then(res => res.json()).then(data => {
    let rows = data['data']
    rows.forEach((a, index) => {
        if (index < 5) {
            console.log(a)

            let title = a['name']
            let name = a['artist']
            let image = a['image']


            let temp_html = `<div class="card">
                <img src="${image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${name}</p>
                </div>
            </div>`;
            $('#rank-card').append(temp_html)
        }

    })
})

function searching(videoId) {
    let iframe = document.getElementById('videoIframe');
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    iframe.src = embedUrl;
    let url_snippet = `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyAIyGyJLimC1Oo9r8_bNWQBVwsLndCsDLk&id=${videoId}`;
    let url_stat = `https://www.googleapis.com/youtube/v3/videos?part=statistics&key=AIzaSyAIyGyJLimC1Oo9r8_bNWQBVwsLndCsDLk&id=${videoId}`;
    fetch(url_snippet).then(res => res.json()).then(data => {
        let title = data['items'][0]['snippet']['title'];
        let description = data['items'][0]['snippet']['description'];
        let channelName = data['items'][0]['snippet']['channelTitle'];
        $('#title').text(title);
        $('#video_description').text(description);
        $('#channelName').text(channelName);
        let title_nospace = title.replace(/(\s*)/g, "");
        let suggestion_api = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAIyGyJLimC1Oo9r8_bNWQBVwsLndCsDLk&q=${title_nospace}`;
        fetch(suggestion_api).then(res => res.json()).then(data => {
            let suggestion_video_1 = data['items'][2]['id']['videoId'];
            let suggestion_api_1 = `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyAIyGyJLimC1Oo9r8_bNWQBVwsLndCsDLk&id=${suggestion_video_1}`
            fetch(suggestion_api_1).then(res => res.json()).then(data => {
                let video_1_title = data['items'][0]['snippet']['title'];
                $('#video_title_1').text(video_1_title);
                let suggestion_image_1 = data['items'][0]['snippet']['thumbnails']['default']['url'];
                document.getElementById('suggestionUrl_1').src = suggestion_image_1;
                $('#video_id_1').text(suggestion_video_1);
            })
            let suggestion_video_2 = data['items'][3]['id']['videoId'];
            let suggestion_api_2 = `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyAIyGyJLimC1Oo9r8_bNWQBVwsLndCsDLk&id=${suggestion_video_2}`
            fetch(suggestion_api_2).then(res => res.json()).then(data => {
                let video_2_title = data['items'][0]['snippet']['title'];
                $('#video_title_2').text(video_2_title);
                let suggestion_image_2 = data['items'][0]['snippet']['thumbnails']['default']['url'];
                document.getElementById('suggestionUrl_2').src = suggestion_image_2;
                $('#video_id_2').text(suggestion_video_1);
            })
        })
        let channelId = data['items'][0]['snippet']['channelId'];
        let channel_api = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAIyGyJLimC1Oo9r8_bNWQBVwsLndCsDLk&q=${channelId}`;
        console.log(channel_api);
        let channel_search = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAIyGyJLimC1Oo9r8_bNWQBVwsLndCsDLk&part=snippet&maxResults=25&channelId=${channelId}&type=video`
        fetch(channel_search).then(res => res.json()).then(data => {
            let suggestion_video_3 = data['items'][2]['id']['videoId'];
            let suggestion_api_3 = `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyAIyGyJLimC1Oo9r8_bNWQBVwsLndCsDLk&id=${suggestion_video_3}`
            // console.log(suggestion_api_3);
            fetch(suggestion_api_3).then(res => res.json()).then(data => {
                let video_3_title = data['items'][0]['snippet']['title'];
                $('#video_title_3').text(video_3_title);
                let suggestion_image_3 = data['items'][0]['snippet']['thumbnails']['default']['url'];
                document.getElementById('suggestionUrl_3').src = suggestion_image_3;
                $('#video_id_3').text(suggestion_video_3);
            })
        })

    })
    fetch(url_stat).then(res => res.json()).then(data => {
        let likeCount = data['items'][0]['statistics']['likeCount'];
        let views = data['items'][0]['statistics']['viewCount'];
        $('#video_like').text(likeCount);
        $('#video_views').text(views);
    })
}
// 로그인시 ID 댓글창에 띄우기 (일단 이메일)
const loginIdCommentSet = () => {
    console.log(getSession('email'));
    if (getSession('email')) {
        let writerId = getSession('email');
        $("#co_writer_input").val(writerId);
    }
    else {
        $("#co_writer_input").val('Anonymous');
    }
}
loginIdCommentSet();

// 댓글저장 버튼 클릭 이벤트
// 검색 버튼 클릭 이벤트
$("#searchBtn").click(async function () {
    let searchStr = document.getElementById('search').value;
    let videoId = searchStr.split("v=")[1].split("&")[0];
    console.log(videoId);
    searching(videoId);

    // 검색시 댓글창 초기화
    const q = query(collection(db, "comments", videoId, "data"));
    const docs = await getDocs(q);
    initComment(docs);
})

$("#searchBtn1").click(async function () {
    searching(document.getElementById('video_id_1').innerText);
})

$("#searchBtn2").click(async function () {
    searching(document.getElementById('video_id_2').innerText);
})
$("#searchBtn3").click(async function () {
    searching(document.getElementById('video_id_3').innerText);
})

// 댓글 저장 버튼 클릭 이벤트
// 댓글 입력시 db에 저장 후 새로고침 필요
$("#co_btn").click(async function () {

    let writer = $("#co_writer_input").val();
    let star = $("#co_star").val();
    let comment = $("#co_input").val();
    comment = comment.replaceAll('\n', '<br>');
    let data = {
        'id': videoLinkID,
        'writer': writer,
        'star': star,
        'comment': comment
    };
    addComment(writer, star, comment);
    await setDoc(doc(collection(db, "comments", videoLinkID, "data"), getSession("email")), data);
    // 저장후 초기화
    //$("#co_writer_input").val("");
    $("#co_star").val("별점선택");
    $("#co_input").val("");
})

// 별표시 함수
function valueToStar(value) {
    let star;
    let val = Number(value);
    switch (val) {
        case 1:
            star = '⭐'; break;
        case 2:
            star = '⭐⭐'; break;
        case 3:
            star = '⭐⭐⭐'; break;
        case 4:
            star = '⭐⭐⭐⭐'; break;
        case 5:
            star = '⭐⭐⭐⭐⭐'; break;
    }
    return star;
}
// 댓글창 append
async function addComment(writer, star, comment) {
    let tempHtml = `
        <div class="card mb-3">
    <div class="card-body w p">
        <!-- 댓글 작성자명 -->
    <div id = "co_writer" class="card-header">${writer}</div>
        <div class="card-body">
            <!-- 별점 -->
            <p id="co_vites" class="card-text co">${valueToStar(star)}</p>
            <!-- 댓글 -->
            <p id="co_text" class="card-text co">${comment}</p>
        </div>
</div>
</div>`;

    $("#commentBlock").append(tempHtml);
}
// 댓글창 초기화
async function initComment(docs) {
    $("#commentBlock").empty();
    console.log(docs);
    docs.forEach((doc) => {
        let row = doc.data();
        let writer = row['writer'];
        let star = row['star'];
        let comment = row['comment'];
        // let id = row['id'];
        // if (id == videoLinkID) {
        // }
        addComment(writer, star, comment);
    });
}

//회원가입
$("#signBtn").click(e => {
    // console.log ("click sign btn");
    // const submitButton = document.getElementById('signBtn');
    e.preventDefault();
    let signEmail = document.getElementById('floatingSInput').value;
    let signPw = document.getElementById('floatingSPassword').value;

    createUserWithEmailAndPassword(auth, signEmail, signPw)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            window.alert("Success");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            window.alert("Error");
        });



})

// TODO 브라우저 쿠키에 로그인 정보 저장 기능 구현
// 로그인
const signin_form_btn = document.getElementById("signin_form_btn");

const signup_link = document.getElementsByClassName("signup-link")[0];
const signin_link = document.getElementsByClassName("login-link")[0];

const signout_btn = document.getElementById("signout_btn");

// 로그인 버튼 클릭 이벤트
signin_form_btn.addEventListener("click", e => {
    e.preventDefault();
    const signin_id = document.getElementById("signin_id").value;
    const signin_pw = document.getElementById("signin_pw").value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, signin_id, signin_pw)
        .then((userCredential) => {
            const user = userCredential.user;
            // 세션에 값 저장
            setSession("uid", user.uid);
            setSession("email", user.email);
            // sign in 페이지 닫기
            $("#loginbtn").modal("hide");
            // top 버튼 확인
            loginCheck();
            loginIdCommentSet();
        })
        .catch((error) => {
            alert("계정이 없거나 아이디 또는 비밀번호를 잘못 입력하셨습니다.");
        });
})

signout_btn.addEventListener("click", () => {
    deleteSession();
    loginCheck();
    loginIdCommentSet();
})
const modal = document.querySelector('.modal');
const modalOpen = document.querySelector('.modal_btn');
const modalcls = document.getElementById('clsbtn');


//열기 버튼을 눌렀을 때 모달팝업이 열림
modalOpen.addEventListener('click', function () {
    //'on' class 추가
    modal.classList.add('on');
});
modalcls.addEventListener('click', function () {
    modal.classList.remove('on');
});
const reset = document.getElementById("reset").addEventListener('click', (event) => {
    event.preventDefault()
    const email = document.getElementById('resetpwd').value
    sendPasswordResetEmail(auth, email)
        .then(() => {
            window.alert("메일 보냄")
            modal.classList.remove('on');
            // ..
        })
        .catch((error) => {
            console.log('이메일입력')
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
})