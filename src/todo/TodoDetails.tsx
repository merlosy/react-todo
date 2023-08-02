import { Todo } from "./todo.model"
import classes from './todo.module.css'

type DetailProps = {
    readonly todo: Todo | null
}

export default function TodoDetails({todo}: DetailProps) {
    return <div className={classes.details}>
        <h2>{todo?.text}</h2>
        <div>{todo?.description}</div>
    </div>
}