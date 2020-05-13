import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '../../../utils/apiHandler';
import { userData } from '../../../../db/user-data';

const users = (_: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!Array.isArray(userData)) {
      throw new Error('Cannot find user data');
    }

    res.status(200).json({
      code: 0,
      message: '',
      data: userData,
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

export default apiHandler(users);
