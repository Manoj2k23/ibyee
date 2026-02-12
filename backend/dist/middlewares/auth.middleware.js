import { supabase } from "../config/supabase.js";
export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { data, error } = await supabase.auth.getUser(token);
    if (error)
        return res.status(401).json({ message: "Unauthorized" });
    req.user = data.user;
    next();
};
//# sourceMappingURL=auth.middleware.js.map