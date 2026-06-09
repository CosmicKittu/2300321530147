import dotenv from "dotenv"

dotenv.config();



export default async function Log(
    stack = "backend",
    level = "error",
    pkg = "handler",
    message = "received string, expected bool"
) {
    const loginUrl = "http://4.224.186.213/evaluation-service/auth";
    const logUrl = "http://4.224.186.213/evaluation-service/logs";
    if (message.length > 48) {
        message = message.slice(0, 48);
    }

    try {
        const ldata = {
            email: process.env.AFFORD_EMAIL,
            name: process.env.AFFORD_NAME,
            rollNo: process.env.AFFORD_ROLLNO,
            accessCode: process.env.AFFORD_ACCESS_CODE,
            clientID: process.env.AFFORD_CLIENT_ID,
            clientSecret: process.env.AFFORD_CLIENT_SECRET,
        };

        const authResponse = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                ldata
            ),
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            console.error("Auth Error:", authData);
            return;
        }

        console.log("Authenticated");

        const logResponse = await fetch(logUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authData.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message,
            }),
        });

        const responseText = await logResponse.text();

        console.log("Status:", logResponse.status);
        console.log("Response:", responseText);

        if (!logResponse.ok) {
            throw new Error(`HTTP Error ${logResponse.status}`);
        }

        // try {
        //   console.log("Parsed:", JSON.parse(responseText));
        // } catch {
        //   console.log("Non-JSON response");
        // }
    } catch (err) {
        console.error("Error:", err);
    }
}


