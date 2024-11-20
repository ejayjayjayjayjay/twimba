import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const tweetsFromLocalStorage = JSON.parse(localStorage.getItem('tweetsData')) || tweetsData

if (tweetsFromLocalStorage) {
    localStorage.setItem('tweetsData', JSON.stringify(tweetsFromLocalStorage))
}

document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
    else if (e.target.dataset.comment) {
        handleReplyTextBtnClick(e.target.dataset.comment)
    }
    else if (e.target.dataset.delete) {
        handleDeleteClick(e.target.dataset.delete)
    }
})

// handle delete tweet

function handleDeleteClick(tweetId){
    const tweetsData = JSON.parse(localStorage.getItem('tweetsData'))
    const updatedTweetsData = tweetsData.filter(function(tweet){
        return tweet.uuid !== tweetId
    })
    localStorage.setItem('tweetsData', JSON.stringify(updatedTweetsData))
    render()
}

// handel like tweet

function handleLikeClick(tweetId) {

    const tweetsData = JSON.parse(localStorage.getItem('tweetsData'))

    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
    render()
}

// handle retweet

function handleRetweetClick(tweetId) {
    const tweetsData = JSON.parse(localStorage.getItem('tweetsData'))
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }
    else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
    render()
}

// handle reply

function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

}

// handle comments

function handleReplyTextBtnClick(tweetId) {
    console.log("T ID: " + tweetId)
    let tweetsData = JSON.parse(localStorage.getItem('tweetsData'))
    let replyInput = document.getElementById(`reply-input-${tweetId}`).value;
    console.log(replyInput)

    if (replyInput) {
        const targetTweetObj = tweetsData.find(function (tweet) {
            return tweet.uuid === tweetId;
        })

        targetTweetObj.replies.push({
            handle: `@josellvibar`,
            profilePic: `./images/ejay.png`,
            tweetText: replyInput,
        });

        localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
        replyInput = '';

        render(tweetsData);
    }
}

// handle new tweet to post

function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')
    const tweetsData = JSON.parse(localStorage.getItem('tweetsData'))

    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
        render()
        tweetInput.value = ''
    }

}

// get the feed on the html

function getFeedHtml() {
    let feedHtml = ``
    const tweetsData = JSON.parse(localStorage.getItem('tweetsData'))

    tweetsData.forEach(function (tweet) {

        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        let repliesHtml = ''

        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function (reply) {
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }

        repliesHtml += `
        <div class="tweet-reply">
            <textarea id='reply-input-${tweet.uuid}' placeholder="Write your reply..."></textarea>
            <button class='reply-button' data-comment="${tweet.uuid}">Reply</button>
        </div>
        `

        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div class="caption">
                    <p class="handle">${tweet.handle}</p>
                    <span class="delete-btn">
                        <i class="fa-solid fa-minus" data-delete="${tweet.uuid}"></i>
                    </span>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>   
        </div>
        `
    })
    return feedHtml
}

// display the html

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

