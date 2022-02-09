import { MessageOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, InputNumber, Radio, Select , Image} from 'antd';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { iconSelector } from '../Components/icons';
import { IChallenge} from '../interfaces';
import AuthService from '../Services/authService';
import { getChallengeId } from '../Services/challengesService';
import "./pages.less"

type Params = {
id: string
}
function ChallengeSummary() {
  const navigate = useNavigate();
  const [user] = useAuthState(AuthService.auth);
  const { id } = useParams<Params>();
  const [challenge, setChallenge] = useState<IChallenge| null>(null);

   function returnHome(): void {
    navigate("/");
   }

  useEffect(() => {
    if (id &&user){
      getChallengeId(user.uid, id)
        .then(res => {
          if (res) {
            setChallenge(prev =>  res[0])
          }
        })
    }

  }, [])

  return ( challenge ?
    <div className='page-Div'>
      <div className='challengeSummary'>

        <h2>Challenge from {challenge.from}</h2>
        <div className="message">
          <MessageOutlined style={{ fontSize: "x-large" }} />
        <p className='message_text'>{challenge.message}</p>
        </div>
        <h3>The workout is:</h3>
        {challenge.workout.map((set) => {
           let Icon = iconSelector(set.exer);
          return <div className="challenge_sets">
            <div className='icon_container'><Avatar icon={<Icon/>} /></div>
            <p>{set.reps} repetition{set.reps >1 && 's'} of {set.exer} {set.rest >0 ? `with a ${set.rest} minute rest`: 'with no rest'}</p>
          </div>
        })

        }
    {/*<div className='name-div'>
      <p style={{margin: '0', fontSize:"medium"}}></p>
    </div>
    {/* <div className='friend-btns'>
      {list === "friends"
        ? <MinusCircleOutlined style={{fontSize:"x-large", color: "#2A9D8F"}} onClick={()=> {removeFromFriendList(profile.userId)}}/>
        : <PlusCircleOutlined style={{fontSize:"x-large", color: "#2A9D8F"}} onClick={()=> {addToFriendList(profile.userId)}}/>
      }
    </div> */}

      {/* </div>
      <h2>And they had this to say about it: </h2>
      <div className='friend-item'>
        <div className='name-div'>
      <p style={{margin: '0', fontSize:"medium"}}>{challenge.message}</p>
    </div>
      </div>
      <h2>This challenge consists of:</h2>

    <Form labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}>
      {challenge.workout.map((set, index) => {
        console.log(set.exer)
        return <div key={index} className="set-Div">
      <div className="set-Div_inputs">
      <Form.Item label="Exercise">
              <Select size="large"  style={{ width: 120 }} disabled={true} defaultValue={set.exer}>
              <Select.Option value={set.exer}>{set.exer}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Nº of repetitions">
              <InputNumber
                size="large"
                min={1}
                max={30}
                style={{ width: 120 }}
           disabled={true}
           defaultValue={set.reps}
              />
            </Form.Item>

            <Form.Item

              label="Rest time"
              >
              <Radio.Group size="large" disabled={true} defaultValue={set.rest} buttonStyle="solid">
                <Radio.Button value={0}>0 min</Radio.Button>
                <Radio.Button value={1}>1 min</Radio.Button>
                <Radio.Button value={3}>3 min</Radio.Button>
                <Radio.Button value={5}>5 min</Radio.Button>
              </Radio.Group>
          </Form.Item>
          </div>
          </div>
      })}
      </Form> */}
      </div>

      <Button onClick={returnHome}>Return to home</Button>
    </div>
    : null);
}

export default ChallengeSummary;