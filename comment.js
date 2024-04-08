var videoID = '0000';

function setVideoId(val) {
    videoID = val;
}

function getVideoId() {
    return videoID;
}

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

async function addComment(writer, star, comment) {
    let doc = {
        'id': videoID,
        'writer': writer,
        'star': star,
        'comment': comment
    };

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
    return doc;
}

async function initComment(docs) {
    $("#commentBlock").empty();
    console.log(docs);
    docs.forEach((doc) => {
        let row = doc.data();
        let writer = row['writer'];
        let star = row['star'];
        let comment = row['comment'];
        let id = row['id'];
        if (id == videoID) {
            addComment(writer, star, comment);
        }
    });
}