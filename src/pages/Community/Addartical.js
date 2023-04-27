import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { HOST, CMPDATA } from '../../components/api_config'
import { LOGIN } from '../../components/api_config'
import AuthContext from '../../contexts/AuthContext'

function AddArtical() {
  const [myForm, setMyForm] = useState({
    account: '',
    password: '',
  })
  const { setMyAuth } = useContext(AuthContext)
  const navigate = useNavigate()
  const { myAuth, logout } = useContext(AuthContext)
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
    const showimg = e.target.files[0]
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    if (showimg) {
      reader.readAsDataURL(showimg);
    }
  };

  const handleFileClearimg = () => {
    setImagePreview(null);
  };

  const [formData, setFormData] = useState({
  });

  const [formData2, setFormData2] = useState({
    member_sid: myAuth.sid,
    message: '',
    title: ''
  });

  function handleSetmessage(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  function handleSetmessage(event) {
    setFormData2({
      ...formData2,
      [event.target.name]: event.target.value
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:3033/community/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(formData)
      console.log("前端:", res.data);

      const res2 = await axios.post(`${CMPDATA}/new/api`,
        { ...formData2, url: res.data },
      )
      console.log("res2:",res2.data);
      if (res2.data.success = 'success') {
        navigate('/community/')
        navigate(`/community/${res2.data.result.insertId}`)
        console.log(formData);
      } else {
        return
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function handleSubmit2(event) {
    event.preventDefault();

    try {
      if (formData2.message.length > 1) {
        const response = await axios.post(`${CMPDATA}/new/api`,
          formData2,
        );
        console.log(response.data);
        if (response.data.success = 'success') {
          // navigate('community')
          console.log(formData2);
        }
      } else {
        console.log("NO!!")
        return
      }
    } catch (error) {
      console.error(error);
      console.error('Axios error:', error.message);
      console.error('Status code:', error.response?.status);
    }
  }

  return (
    <div className='m-session d-flex justify-content-center pb-5'>
      {/* 功能列 */}
      <div className='cm-container d-flex flex-column  col-10 mt-2'>
        <div className='w-100 d-flex justify-content-between'>
          <div className='cm-select-bar d-flex justify-align-content-between align-items-center gap-2 mt-3 ms-2 me-2 text-center '>
            <div className='cm-select-bar-btn d-flex justify-content-center align-items-center'>
              <p className='cm-pbt'>發表新文章</p>
            </div>
            <div className='cm-select-bar-btn d-flex justify-content-center align-items-center'>
              <p className='cm-pbt'>我的文章</p>
            </div>
          </div>
          <div className='cm-select-bar  d-flex justify-align-content-between align-items-center gap-2 mt-3 ms-2 me-2 text-center '>
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

        {/* 文章卡片區域 */}
        {/* 擺放卡片位置的地方vvvv */}
        <div className='cm-artical-session d-flex flex-column justify-content-center align-items-center col-12 mt-5'>
          <form onSubmit={handleSubmit
          }>
            <div className='cm-artical-card2 position-relative mt-1'>
              <div className='w-100 '>
                <div className='cm-img-area2 d-flex justify-content-center align-items-center'>
                  <div className={`cm-artical-innerimg2 ${imagePreview ? "add" : ""}`} >
                    {imagePreview ?
                      <div>
                        <img className='cm-preimage' src={imagePreview}></img>
                        <img className='cm-addp cm-addp-position2 cm-pointer' src='http://localhost:3000/Icons/delete.png'
                          onClick={handleFileClearimg}
                        ></img>
                      </div>
                      :
                      <div className='position-relative cm-imge-pre-container '>

                        <input
                          className='position-absolute cm-hide-upload z-1 cm-pointer '
                          type="file"
                          accept='image/*'
                          onChange={
                            handleFileInputChange
                          }>
                        </input>
                        <img className='cm-addp cm-addp-position' src='http://localhost:3000/Icons/add.png'></img>

                      </div>
                    }
                  </div>
                </div>
                <div className='cm-member-info w-100 d-flex align-items-end ms-3'>
                </div>
              </div>


              {/* 文章 */}
              <div className='cm-arti-show d-flex justify-content-around w-100 bg-white'>
                <div className='cm-artical-contain-area2 w-100 bg-white d-flex'>
                  <div className='cm-artical ms-5 me-5 mt-3 w-100'>

                    <div className='cm-headder-input2'>
                      <input
                        className='w-100  cm-like-span ms-4 me-4  '
                        type='text'
                        name="title"
                        placeholder='文章標題'
                        maxLength={12}
                        value={formData2.name}
                        onChange={handleSetmessage}>
                      </input>
                    </div>
                    <div className='cm-headder-input cm-comment-area cm-like-span d-flex'>

                      <textarea
                        className='w-100   ms-4 me-4 cm-like-span mt-2 '
                        rows="5" cols="33"
                        name="message"
                        maxLength={100}
                        placeholder='點此輸入文章內容'
                        value={formData2.name}
                        onChange={handleSetmessage}
                      >
                      </textarea>
                    </div>

                  </div>
                  <span className='cm-artical cm-left-text fw-bolder position-absolute cm-input-hint'>
                    {formData2.message.length > 0 ? formData2.message.length < 100 ?
                      (formData2.message.length) + "/100" : "已經不能再輸入囉！" : ""}
                  </span>
                </div>
              </div>
              <div className='w-75 ms-2 mt-2 d-flex justify-content-around align-items-center'>
                <a onClick={handleSubmit}>
                  <div className='cm-summit-area MB-table-btn'>
                    <img src='http://localhost:3000/Buttons/addA.png'></img>
                  </div>
                </a>
                <a href='/Community'>
                  <div className='cm-summit-area MB-table-btn'>
                    <img src='http://localhost:3000/Buttons/cancelA.png'></img>
                  </div>
                </a>
              </div>
            </div>
          </form>



        </div>
        <a className='cm-card-close position-absolute' href='/communicate'>
          <img src='http://localhost:3000/Icons/close.png'></img>
        </a>
        {/* 文章卡片區域 */}
      </div>
    </div>



  )
}

export default AddArtical