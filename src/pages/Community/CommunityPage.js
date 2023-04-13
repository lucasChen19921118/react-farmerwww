import { HOST, CMMA, CMADD } from '../../components/api_config'
import { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import axios from 'axios'
import dayjs from 'dayjs'
import AuthContext from '../../contexts/AuthContext'


//引入樣式
import '../../css/members.css'
import '../../css/community.css'

function CommunityPage() {

    const { sid } = useParams()
    const location = useLocation();
    const usp = new URLSearchParams(location.search);
    const navigate = useNavigate()
    const [users, setUsers] = useState([]) //要保持此狀態一直是陣列！
    const { setMyAuth } = useContext(AuthContext)
    const { myAuth, logout } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(true)
    const [myImg, setMyImg] = useState('')


    const [CMPData, setCMPData] = useState({
        row: [],
    });
    const [CMPRE, setCMPREData] = useState({
        row2: [],
    });

    const [newMessage, setNewMessage] = useState([]);


    const [formData, setFormData] = useState({
        member_sid: myAuth.sid,
        community_sid: sid,
        message: ''
    });

    function handleSetmessage(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    function handleClearMessage(e) {
        document.getElementById('cmReply').value = ""
        setFormData({
            member_sid: myAuth.sid,
            community_sid: sid,
            message: "",
        })
    }

    const handleImg = () => {
        const myAuth = JSON.parse(localStorage.getItem('myAuth'))
        axios
            .post(`${HOST}/memberImg/myImg`, {
                headers: {
                    Authorization: 'Bearer ' + myAuth.token,
                },
                myAuth: myAuth,
            })
            .then((response) => {
                setMyImg(response.data.member_img)
                console.log('Imgformdata', response.data.member_img)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const getCMPData = async () => {
        const res = await axios.get(`http://localhost:3033/community/${sid}`, {
            params: { sid }
        })

        setCMPData(res.data)
        console.log(CMPData)

    };

    const getCMPREData = async () => {
        const res = await axios.get(`http://localhost:3033/community/reply/${sid}`, {
            params: { sid }
        })

        setCMPREData(res.data)
        console.log(CMPRE)
    };

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3033/community/sent', formData);
            console.log(response.data);
            document.getElementById('cmReply').value = ""
            setFormData({
                member_sid: myAuth.sid,
                community_sid: sid,
                message: "",
            })
            if (response.data.success = 'success') {
                setIsLoading(true)

                //送出留言後 重新取得資料
                const res = await axios.get(`http://localhost:3033/community/reply/${sid}`, {
                    params: { sid }
                })
                setCMPREData(res.data)

            } else {
                alert('錯誤！！')
                return
            }
        } catch (error) {
            console.error(error);
        }
    }

    const Message = (
       
        
        <div
            className="cm-pointer P-commnet-info cm-noshadow cm-replyray d-flex flex-column d-md-flex align-items-center gap-4"
        >
            {CMPRE.row2.length == 0 ?
            <div className='d-flex justify-content-center align-items-center mt-5'>
            <h3 className='text-success'>來新增第一篇留言吧！</h3>
            </div>
                :
                    CMPRE.row2.map((v, i) => {
                        return (
                            <div
                                key={v.sid}
                                className="cm-pointer P-commnet-info cm-noshadow cm-replyray d-flex flex d-md-flex align-items-center"
                            >
                                <div className="P-commnet-avatar d-flex flex-column  align-items-center gap-2">
                                    <div>
                                        <img
                                            src={
                                                v.member_img
                                                    ? `${HOST}/images/avatar/${v.member_img}`
                                                    : `${HOST}/images/avatar/none.png`
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <span>{v.member_name || '匿名'}</span>
                                </div>
                                <div className="P-commnet-text cm-replay-area-inner d-flex flex-column align-items-center justify-content-center w-100">
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <span className='w-100'>{v.message}</span>
                                        <span>
                                            {dayjs(v.message_created_at).format('YYYY/MM/DD')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                
                }
           
        </div>
    )

    useEffect(() => {
        getCMPData(sid).then(() => {
        })
    }, [sid])

    useEffect(() => {
        getCMPREData()
    }, [])

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                setIsLoading(false)
            }, Math.random() * 1500)
        }
    }, [isLoading, CMPRE])



    useEffect(() => {
        setIsLoading(true)
    }, [newMessage, CMPRE])

    useEffect(() => {
        handleImg()
        return () => {
            console.log('unmount')
        }
    }, [])

    const loader = (
        <div className="lds-ripple">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )

    return (
        <div className='m-session d-flex justify-content-center pb-5  cm-session cm-re-m '>
            {/* 功能列 */}
            <div className='cm-container d-flex flex-column  col-10 h-100 mt-4'>
                <div className='w-100 d-flex justify-content-between'>
                    <div className='cm-select-bar d-flex justify-align-content-between align-items-center gap-2 mt-3 ms-2 me-2 text-center '>
                        <div className='cm-select-bar-btn d-flex justify-content-center align-items-center'>
                            <a href='/AddArtical'><p className='cm-pbt'>發表新文章</p></a>
                        </div>
                        <div className='cm-select-bar-btn d-flex justify-content-center align-items-center'>
                            <p className='cm-pbt'>我的文章</p>
                        </div>
                    </div>
                    <div className='cm-select-bar  d-flex justify-align-content-between align-items-center gap-2 mt-3 ms-2 me-2 text-center d-none '>
                        <div className='cm-select-bar-btn  d-flex justify-content-center align-items-center'>
                            <p>文章排列方式:</p>
                        </div>
                        <div className='cm-select-bar-btn d-flex justify-content-center align-items-center'>
                            <p className='cm-pbt'>發文時間</p>
                        </div>
                        <div className='cm-select-bar-btn d-flex justify-content-center align-items-center'>
                            <p className='cm-pbt'>熱門迴響</p>
                        </div>
                    </div>
                </div>
                {/* 功能列 結束*/}

                {/* 文章卡片 */}
                {/* 擺放卡片位置的地方vvvv */}
                <div className="d-flex position-absolute cm-back">
                    <div
                        onClick={() => {
                            navigate(-1)
                        }}
                    >
                        <button className="M-back"></button>
                    </div>
                </div>
                <div className='cm-artical-session w-100 d-flex justify-content-center align-items-start mt-3 col-12 h-100  gap-5 flex-wrap'>
                    {CMPData.row.map(row => (
                        <div key={row.sid} className='cm-artical-card3 mt-1'>
                            <div className='cm-artical-innerimg' >
                                <img src={`${HOST}/images/community/` + `${row.community_picture1}`}></img>
                            </div>
                            <div className='cm-member-info w-100 cm-noshadow d-flex align-items-end ms-3'>
                                <div className='cm-member-ava'>
                                    <img src={`${HOST}/images/avatar/` + `${row.member_img}`}></img>
                                </div>
                                <div className='d-flex flex-column ms-2 w-75 '>
                                    <div className='cm-member-detail d-flex justify-content-between'>
                                        <span className='fs-6'>BY {row.member_name}</span>
                                        <span className='fs-6'>
                                            發表於:
                                            {dayjs(row.community_created_at).format("YYYY-MM-DD")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 點讚區 */}

                            <div className='d-flex justify-content-around cm-like-area'>
                                <div className='cm-like-comments w-50 m-4 d-flex gap-3'>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <img src='/icons/like.png'></img>
                                        <div className='cm-like-span text-success fs-6'>(23)</div>
                                    </div>

                                    <div className='d-flex gap-2 align-items-center'>
                                        <img src='/icons/comment.png'></img>
                                        <div className='cm-like-span  fs-6'>({CMPRE.row2.length})</div>
                                    </div>
                                </div>


                                <div className='cm-like-comments w-50 m-4 d-flex align-items-center justify-content-end gap-3'>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <img src='/icons/instagram.png'></img>
                                    </div>

                                    <div className='d-flex gap-2 align-items-center'>
                                        <img src='/icons/facebook.png'></img>
                                    </div>
                                </div>
                            </div>

                            {/* 文章 */}
                            <div className='cm-arti-show d-flex justify-content-around w-100 h-100 bg-white'>
                                <div className='cm-artical-contain-area w-100 h-100 bg-white d-flex'>
                                    <div className='cm-artical2 ms-5 me-5 mt-4 w-100'>
                                        <h3>{row.community_header}</h3>
                                        <span className='fs-6'>{row.community_contain}</span>
                                    </div>
                                </div>
                            </div>




                        </div>
                    ))}



                    {/* 文章卡片 */}

                    {/* 文章回覆 */}
                    <div className='d-flex flex-column gap-3 h-25 cm-artical2 cm-replay-area'>
                        {/* 用戶回覆區 */}
                        {myAuth.authorized ?
                            <form onSubmit={handleSubmit}>
                                <div
                                    className="cm-pointer cm-input cm-noshadow cm-replay-area-inner cm-replyray d-flex flex d-md-flex align-items-center"
                                >
                                    <div className="P-commnet-avatar cm-replay-area-inner d-flex flex-column  align-items-center gap-2">
                                        <div>
                                            {/* <img
                                                src={`${HOST}/images/avatar/${myAuth.member_img}`}
                                                alt=""
                                            /> */}
                                            {myImg && (
                                                <img src={`${HOST}/images/avatar/${myImg}`} alt="{myImg}" />
                                            )}
                                        </div>
                                        <span>{myAuth.member_name}</span>
                                    </div>
                                    <div className="P-commnet-text d-flex flex-column align-items-center justify-content-center h-auto">
                                        <div className='d-flex flex-column justify-content-end align-items-end'>
                                            <textarea
                                                id="cmReply"
                                                name="message"
                                                rows="5" cols="33" placeholder='點擊輸入留言'
                                                maxLength="50"
                                                className='w-100 cm-input-text cmReply p-3'
                                                value={formData.name}
                                                onChange={handleSetmessage}
                                            >
                                            </textarea>
                                            <div className='d-flex align-items-center position-relative w-100 justify-content-end'>
                                                <span className='cm-artical cm-left-text fw-bolder fs-6  me-2 position-absolute'>
                                                    {formData.message.length > 0 ? formData.message.length < 50 ?
                                                        (formData.message.length) + "/50" : "已經不能再輸入囉！" : ""}
                                                </span>
                                                <div className="MB-table-btn me-md-3 ms-auto ms-md-0 cm-send d-flex justify-content-center align-items-center p-2"
                                                    onClick={handleSubmit}
                                                ><i className="fa-solid fa-paper-plane me-1"></i>
                                                </div>
                                                <div className="MB-table-btn me-md-3 ms-auto ms-md-0 cm-send d-flex justify-content-center align-items-center p-2"
                                                    onClick={handleClearMessage}
                                                >
                                                    <i class="fa-sharp fa-solid fa-xmark"></i>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </form> : ""}

                        {isLoading ? loader : Message}

                    </div>

                </div>
            </div>
        </div>
    )
}

export default CommunityPage
