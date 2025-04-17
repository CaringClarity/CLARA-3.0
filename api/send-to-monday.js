import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const {
    firstName,
    lastName,
    email,
    state,
    insurance,
    serviceType,
    availability
  } = req.body;

  const columnValues = JSON.stringify({
    text__1: firstName,
    dup__of_first_name__1: lastName,
    email: { email, text: email },
    ins_company1: insurance,
    status8: { label: state },
    minor_6: { label: serviceType },
    long_text4: availability
  });

  const query = `
    mutation CreateItem($boardId: Int!, $itemName: String!, $columnVals: JSON!) {
      create_item(
        board_id: $boardId,
        item_name: $itemName,
        column_values: $columnVals
      ) {
        id
      }
    }
  `;

  const variables = {
    boardId: parseInt(process.env.MONDAY_BOARD_ID),
    itemName: `${firstName} ${lastName}`,
    columnVals: columnValues
  };

  try {
    const response = await axios.post(
      'https://api.monday.com/v2',
      { query, variables },
      {
        headers: {
          Authorization: process.env.MONDAY_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({ success: true, itemId: response.data.data.create_item.id });
  } catch (error) {
    console.error('Monday API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
