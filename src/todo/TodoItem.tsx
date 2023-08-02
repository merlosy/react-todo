import { Todo } from './todo.model';
import classes from './todo.module.css'

type TodoItemProps = {
    readonly todo: Todo;
    readonly isEditing: boolean;
    deleteClicked: (id: string) => void
    toggleEdit: (id: string, value?: string) => void
};

function TodoItem({todo, isEditing, deleteClicked, toggleEdit}: TodoItemProps) {
    const style = { backgroundColor: todo.bgColor };
    const link = todo.link? <a href={todo.link} target='_blank'>See more</a> : '';
    /** Submit callback */
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toggleEdit(todo.id, (e.target as any).text.value)
    }
    const text = isEditing ? 
        <form onSubmit={onSubmit}>
            <button type="submit">Save</button>
            <input name="text" defaultValue={todo.text} />
        </form>
        : <>
        <button onClick={() => toggleEdit(todo.id)}>Edit</button>
            <span>
                { todo.text }
            </span>
        </>;

    return (
    <div className={classes.todoitem} style={style}>
        {text}
        {link}
        <button onClick={() => deleteClicked(todo.id)}>Delete</button>
    </div>
    )
}

export default TodoItem