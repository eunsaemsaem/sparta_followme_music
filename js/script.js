// 검색 버튼 클릭
$("#searchBtn").click(async function () {
    let searchStr = document.getElementById('search').value;
    console.log(searchStr);
    let videoId = searchStr.split("v=")[1].split("&")[0];
    console.log(videoId);
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
    })
    fetch(url_stat).then(res => res.json()).then(data => {
        let likeCount = data['items'][0]['statistics']['likeCount'];
        let views = data['items'][0]['statistics']['viewCount'];

        $('#video_like').text(likeCount);
        $('#video_views').text(views);
    })
})