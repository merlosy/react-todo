import { Todo } from './todo.model';
import classes from './todo.module.css'

type TodoItemProps = {
    readonly todo: Todo;
    readonly isEditing: boolean;
    onClick: (id: string) => void,
    deleteClicked: (id: string) => void
    toggleEdit: (id: string, value?: string) => void
};

function TodoItem({todo, isEditing, deleteClicked, toggleEdit, onClick}: TodoItemProps) {
    const style = { backgroundColor: todo.bgColor };
    const link = todo.link? <a href={todo.link} target='_blank'>See more</a> : '';
    /** Submit callback */
    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        e.stopPropagation();
        toggleEdit(todo.id, (e.target as any).text.value)
    }
    /** Deleted callback */
    const onDeletedClicked: React.MouseEventHandler<HTMLButtonElement> = e => {
        e.stopPropagation();
        deleteClicked(todo.id);
    }
    /** Toggle edit callback */
    const onToggleEdit: React.MouseEventHandler<HTMLButtonElement> = e => {
        e.stopPropagation();
        toggleEdit(todo.id);
    }
    const text = isEditing ? 
        <form onSubmit={onSubmit}>
            <button type="submit" onClick={e => e.stopPropagation()}>Save</button>
            <input name="text" defaultValue={todo.text} onClick={e => e.stopPropagation()}/>
        </form>
        : <>
        <button onClick={onToggleEdit}>Edit</button>
            <span>
                { todo.text }
            </span>
        </>;

    return (
    <div className={classes.todoitem} style={style} onClick={() => onClick(todo.id)}>
        {text}
        {link}
        <button onClick={onDeletedClicked}>Delete</button>
    </div>
    )
}

export default TodoItem