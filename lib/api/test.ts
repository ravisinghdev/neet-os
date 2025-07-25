import axios from "axios";

export async function getTestMeta() {
	const res = await axios.get("/api/test/homepage");
	return res.data.test;
}
