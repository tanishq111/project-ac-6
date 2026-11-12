import { useState } from "react";
import { useUsers } from "./useUsers.js";

const PeoplePage = () => {
	const { status, users, error, retry } = useUsers();
	const [search, setSearch] = useState("");
	const visibleUsers = users.filter((user) => (
		user.name.toLowerCase().includes(search.trim().toLowerCase())
	));

	return (
		<>
			<h1 tabIndex={-1}>People</h1>
			<div className="field">
				<label htmlFor="people-search">Search people</label>
				<input id="people-search" value={search} onChange={(event) => setSearch(event.target.value)} />
			</div>
			{status === "loading" && <p role="status">Loading people...</p>}
			{status === "error" && (
				<div>
					<p className="error" role="alert">{error}</p>
					<button type="button" onClick={retry}>Retry</button>
				</div>
			)}
			{status === "success" && (visibleUsers.length === 0 ? <p>No matching people.</p> : (
				<ul className="people-list">
					{visibleUsers.map((user) => (
						<li key={user.id}><strong>{user.name}</strong><span>{user.email}</span></li>
					))}
				</ul>
			))}
		</>
	);
}
export default PeoplePage;
