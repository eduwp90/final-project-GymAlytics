import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Radio, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ISet, IWorkoutContext } from "../interfaces";
import "./pages.less";
import "../Components/components.less";
import { addWorkout, updateWorkout } from "../Services/dbService";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import { WorkoutContext } from "../Context/workoutProvider";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const WorkoutSummary: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [setsDisabled, setSetsDisabled] = useState<boolean>(true);
  const [sets, setSets] = useState<JSX.Element[]>([]);
  const {workout, clearWorkout, savedWorkout, clearSavedWorkout} = useContext<IWorkoutContext>(WorkoutContext)
  const navigate = useNavigate()
  const workoutFromContext = (workout.length > 0 ? workout : (savedWorkout && savedWorkout.workout))

  const onFinish = (e: React.FormEvent<HTMLInputElement>): void => {
    const workoutArray = Object.values(e);
    const name: string = workoutArray.pop();
    const sets: ISet[] =  workoutArray;
    if (user) {
      if (workout.length > 0) {
        addWorkout(user.uid, sets, name)
        .then(() => { clearWorkout() })
        .then(() => { navigate('/') })
        .catch((e)=>{console.log(e)})
      }
      else if (savedWorkout) {
        console.log(savedWorkout)
        console.log(name)
        console.log(sets)
        updateWorkout(savedWorkout.id, sets, name)
        .then(() => { clearSavedWorkout() })
        .then(() => { navigate('/') })
        .catch((e)=>{console.log(e)})
      }
    }
  };

  const setsArray: JSX.Element[] | null = workoutFromContext && workoutFromContext.map((set) => {
    const id: number = workoutFromContext.indexOf(set);
    console.log(id)
    return (
      <div key={id} id={`${id}`} className="set-Div">
        <div className="set-Div_inputs">
          <Form.Item
            name={[id, "exer"]}
            label="Select Exercise"
            rules={[
              {
                required: true
              }
            ]}
            initialValue={set.exer}>
            <Select size="large" placeholder="exercise" style={{ width: 120 }} disabled={setsDisabled}>
              <Option value="push-ups">push ups</Option>
              <Option value="squats">squats</Option>
              <Option value="lunges">lunges</Option>
              <Option value="jumping-jacks">jumping jacks</Option>
              <Option value="side-squats">side squats</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={[id, "reps"]}
            label="Nº of repetitions"
            rules={[
              {
                required: true
              }
            ]}
            initialValue={set.reps}>
            <InputNumber
              size="large"
              placeholder="Reps"
              min={1}
              max={30}
              style={{ width: 120 }}
              disabled={setsDisabled}
            />
          </Form.Item>

          <Form.Item
            name={[id, "rest"]}
            label="Rest time"
            rules={[
              {
                required: true
              }
            ]}
            initialValue={set.rest}>
            <Radio.Group size="large" disabled={setsDisabled} buttonStyle="solid">
              <Radio.Button value={0}>0 min</Radio.Button>
              <Radio.Button value={1}>1 min</Radio.Button>
              <Radio.Button value={3}>3 min</Radio.Button>
              <Radio.Button value={5}>5 min</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>
        <Button className="round_button" onClick={() => removeSet(id)}>
          <CloseOutlined />
        </Button>
      </div>
    );
  });

  function removeSet(id: number): void {
    setSets((prev) => prev.filter((set) => parseInt(set.props.id) !== id));
  }
  function handleEdit(): void {
    setSetsDisabled(false);
  }

  useEffect(() => {
    if (setsArray) {
      setSets(setsArray);
    }
  }, [setsDisabled]);

  useEffect(() => {
     if (setsArray) {
      setSets(setsArray);
    }
  }, []);

  return (
    <div className="pages-Div">
      <h2>Workout Summary</h2>
      <Form id="summaryForm" onFinish={onFinish}>
        <Form.Item
          name="workout_name"
          label="Give your workout a name"
          rules={[
            {
              required: true
            }
          ]}
        initialValue={savedWorkout && savedWorkout.name}>
          <Input placeholder="e.g. Workout 1" />
        </Form.Item>
        <p>
          Would you like to edit your sets? <Button onClick={() => handleEdit()}>Edit</Button>
        </p>
        {sets}
        <div className={savedWorkout ? "buttonDiv" : ''}>
          { savedWorkout &&<Button onClick={(()=>{navigate('/')})}>Return to home</Button> }
        <Button type="primary" htmlType="submit">
          Save workout
        </Button>
          </div>

      </Form>
      ;
    </div>
  );
};

export default WorkoutSummary;
