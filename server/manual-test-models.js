/**
 * Manual test script to verify Conversation and ConversationMessage models
 * Run with: node manual-test-models.js
 */

import mongoose from 'mongoose';
import ConversationModel from './app/data/resolvers/models/ConversationModel.js';
import ConversationMessageModel from './app/data/resolvers/models/ConversationMessageModel.js';

// MongoDB connection string - update with your actual connection
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/quotevote-test';

async function testModels() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Create a Conversation
    console.log('📝 Test 1: Creating a conversation...');
    const user1Id = new mongoose.Types.ObjectId();
    const user2Id = new mongoose.Types.ObjectId();
    
    const conversation = new ConversationModel({
      participantIds: [user1Id, user2Id],
      isRoom: false,
    });
    
    const savedConversation = await conversation.save();
    console.log('✅ Conversation created:', {
      id: savedConversation._id,
      participants: savedConversation.participantIds.length,
      isRoom: savedConversation.isRoom,
      createdAt: savedConversation.createdAt,
    });
    console.log('');

    // Test 2: Create a Room Conversation with postId
    console.log('📝 Test 2: Creating a room conversation...');
    const postId = new mongoose.Types.ObjectId();
    const roomConversation = new ConversationModel({
      participantIds: [user1Id, user2Id, new mongoose.Types.ObjectId()],
      isRoom: true,
      postId: postId,
    });
    
    const savedRoom = await roomConversation.save();
    console.log('✅ Room conversation created:', {
      id: savedRoom._id,
      participants: savedRoom.participantIds.length,
      isRoom: savedRoom.isRoom,
      postId: savedRoom.postId,
    });
    console.log('');

    // Test 3: Create Messages
    console.log('📝 Test 3: Creating messages...');
    const message1 = new ConversationMessageModel({
      conversationId: savedConversation._id,
      authorId: user1Id,
      body: 'Hello! This is the first message.',
    });
    
    const message2 = new ConversationMessageModel({
      conversationId: savedConversation._id,
      authorId: user2Id,
      body: 'Hi! Nice to hear from you.',
    });
    
    const savedMessage1 = await message1.save();
    const savedMessage2 = await message2.save();
    
    console.log('✅ Messages created:', {
      message1: {
        id: savedMessage1._id,
        body: savedMessage1.body.substring(0, 30) + '...',
        createdAt: savedMessage1.createdAt,
      },
      message2: {
        id: savedMessage2._id,
        body: savedMessage2.body.substring(0, 30) + '...',
        createdAt: savedMessage2.createdAt,
      },
    });
    console.log('');

    // Test 4: Query Messages by Conversation
    console.log('📝 Test 4: Querying messages by conversation...');
    const messages = await ConversationMessageModel.find({
      conversationId: savedConversation._id,
    }).sort({ createdAt: 1 });
    
    console.log(`✅ Found ${messages.length} messages in conversation`);
    messages.forEach((msg, idx) => {
      console.log(`   Message ${idx + 1}: "${msg.body.substring(0, 40)}..."`);
    });
    console.log('');

    // Test 5: Update a Message (Edit)
    console.log('📝 Test 5: Editing a message...');
    const editedMessage = await ConversationMessageModel.findByIdAndUpdate(
      savedMessage1._id,
      {
        $set: {
          body: 'Hello! This is the EDITED first message.',
          editedAt: new Date(),
        },
      },
      { new: true }
    );
    
    console.log('✅ Message edited:', {
      id: editedMessage._id,
      body: editedMessage.body.substring(0, 40) + '...',
      editedAt: editedMessage.editedAt,
    });
    console.log('');

    // Test 6: Find Conversations by Participant
    console.log('📝 Test 6: Finding conversations by participant...');
    const userConversations = await ConversationModel.find({
      participantIds: user1Id,
    });
    
    console.log(`✅ Found ${userConversations.length} conversations for user1`);
    userConversations.forEach((conv, idx) => {
      console.log(`   Conversation ${idx + 1}: ${conv.isRoom ? 'Room' : 'Direct'} with ${conv.participantIds.length} participants`);
    });
    console.log('');

    // Test 7: Verify Indexes
    console.log('📝 Test 7: Verifying indexes...');
    const conversationIndexes = await ConversationModel.collection.getIndexes();
    const messageIndexes = await ConversationMessageModel.collection.getIndexes();
    
    console.log('✅ Conversation indexes:', Object.keys(conversationIndexes));
    console.log('✅ Message indexes:', Object.keys(messageIndexes));
    console.log('');

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await ConversationModel.deleteMany({
      _id: { $in: [savedConversation._id, savedRoom._id] },
    });
    await ConversationMessageModel.deleteMany({
      conversationId: savedConversation._id,
    });
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run tests
testModels();
