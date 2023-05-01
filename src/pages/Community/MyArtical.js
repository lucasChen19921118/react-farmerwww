import { HOST, CMMA, CMADD } from '../../components/api_config'
import { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import Modal from 'react-modal';

import axios from 'axios'
import dayjs from 'dayjs'
import AuthContext from '../../contexts/AuthContext'
import {
  ListMotionContainer,
  ListMotionItem,
} from '../../components/ListMotion'



//引入樣式
import '../../css/members.css'
import '../../css/community.css'

function MyArtical() {

  const { sid } = useParams()
  const location = useLocation();
  const usp = new URLSearchParams(location.search);
  const navigate = useNavigate()
  const [users, setUsers] = useState([]) //要保持此狀態一直是陣列！
  const { setMyAuth } = useContext(AuthContext)
  const { myAuth, logout } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const [myImg, setMyImg] = useState('')
  const [messageID, setMessageID] = useState('')
  const [backgroundURL, setbackgroundURL] = useState([123])

  const messIDRef = useRef(null)


  const [CMPData2, setCMPData2] = useState({
    pages: 0,
    totalP: 0,
    totalPagesP: 0,
    mycommunity: []
  });

  const [CMPRE, setCMPREData] = useState({
    row2: [],
  });

  const [newMessage, setNewMessage] = useState([]);
  const [correctDelete, setcorrectDelete] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };


  
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

    if (myAuth !== null) {
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
    } else
      return
  }

  const getCMPData2 = async () => {
    const myAuthCheck = JSON.parse(localStorage.getItem('myAuth'))
    try {
      if (myAuthCheck !== null) {
        const res = await axios.get(`http://localhost:3033/community/api/myartical/${myAuth.sid}`);
        setCMPData2(res.data);
        console.log("篩選:", CMPData2)
      } else {
        alert("還沒有登入喔！")
        window.location.href = '/Login';
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const getCMPREData = async () => {
  //   const res = await axios.get(`http://localhost:3033/community/reply/${sid}`, {
  //     params: { sid }
  //   })

  //   setCMPREData(res.data)
  //   console.log(CMPRE)
  // };

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (formData.message.length > 1) {
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
        }
      } else {
        return
      }
    } catch (error) {
      console.error(error);
    }
  }


  async function handleDeletemessage(event) {
    const haha = messIDRef.target = event.target.id
    const replymessage = { sid: haha }
    console.log(replymessage)
    try {
      const response = await axios.post(`http://localhost:3033/community/delete`,
        replymessage,
        { headers: { Authorization: 'Bearer ' + myAuth.token } }
      );
      console.log(response.data);
      if (response.data.success = 'success') {
        setIsLoading(true)
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


  useEffect(() => {
    getCMPData2(sid).then(() => {
    })
  }, [sid])



  // useEffect(() => {
  //   if (messIDRef.current) {
  //     console.log("REF", messIDRef.current.id)
  //   }
  // }, [messageID])

  // useEffect(() => {
  //   if (isLoading) {
  //     setTimeout(() => {
  //       setIsLoading(false)
  //     }, Math.random() * 1500)
  //   }
  // }, [isLoading])



  // useEffect(() => {
  //   setIsLoading(true)
  // }, [newMessage, CMPRE, backgroundURL,])

  useEffect(() => {
    handleImg()
    return () => {
      console.log('unmount')
    }
  }, [])



  const filteredData = CMPData2.mycommunity.filter(mycommunity => mycommunity.sid == messageID)





  const loader = (
    <div className="lds-ripple d-flex justify-content-center">
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

  const myarti = (
    <div>
      <div>
        <ListMotionContainer element="div" className="row cm-pointer">
          {CMPData2.mycommunity.map((mycommunity, i) => (
            <ListMotionItem key={mycommunity.sid} element="div" noShift>
              <div
                className='M-Item d-flex p-3 cm-artical-border align-items-center'
                value={mycommunity.sid}
                onClick={
                  () => {
                    setMessageID(mycommunity.sid);
                    handleOpenModal()
                  }}
                id='cmMessage'
              >
                <div className='cm-index d-flex justify-content-center'>
                  <div className='f-Brown'>{i + 1}</div>
                </div>
                <div className='cm-myImg me-4'>
                  <img src={`${HOST}/images/community/` + `${mycommunity.community_picture1}`}></img>
                </div>
                <div className='col-10'>
                  <div className='fs-5 cm-headder-input3 f-Brown col-lg-10 col-md-8'>{mycommunity.community_header}</div>
                  <div className='f-Gray fs-6'>發表日期：{dayjs(mycommunity.community_created_at).format("YYYY-MM-DD")}</div>
                </div>
              </div>
            </ListMotionItem>
          ))}

        </ListMotionContainer>
      </div>
    </div>
  )

  const myPreview =
    <div className='w-100 d-flex flex-wrap justify-content-center gap-5'>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="cm-modal fade-in3 d-flex flex-column align-items-center justify-content-center"
        overlayClassName="overlay"
      >
        <div className='cm-pointer MB-table-btn cm-closeW d-flex justify-content-center align-items-center' onClick={handleCloseModal}>
          <i class="fa-solid fa-circle-xmark fs-3"></i>
        </div>
        <div>
          {messageID}
          <div>
            {filteredData.map(mycommunity => (
              <div className='fade-in3 d-flex flex-column' key={mycommunity.sid}>
                <div>{mycommunity.community_header}</div>
                <div>{mycommunity.community_contain}</div>
            

              </div>
            ))}
          </div>

        </div>


      </Modal>
    </div>

  return (
    <div className='d-flex justify-content-center pb-5 cm-session m-session cm-re-m'>
      <div className='position-relative cm-label'>
        <div className="d-flex position-absolute cm-back2">
          <div
            onClick={() => {
              navigate(-1)
            }}
          >
            <button className="M-back"></button>
          </div>
        </div>
        <div
          className='C-Order-t2'
          data-count={CMPData2.mycommunity.length}
        >
        </div>
      </div>
      <div className='cm-container d-flex flex-wrap col-10 cm-margin-top cm-h-full z-1 gap-5'>
        <div className='backgound-w w-50 rounded-20 shadow-1 p-sm-3 p-lg-5 f-B h-75 overflow-scroll'>
          {myarti}
        </div>
      </div>
      <div className='d-flex flex-column justify-content-center'>
        <div className='cm-artical-session d-flex justify-content-center align-items-start h-100 mt-4 gap-5 flex-wrap'>
          <div className=''>

            {myPreview}

          </div>
        </div>
      </div>

    </div>
  )
}

export default MyArtical
